import express, { type Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  connectDatabase,
  Song,
  PV,
  Calendar,
} from "@vocaloid-birthday/database";
import { Op, fn, col, where } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { join } from "path";
import { Low } from "lowdb/lib";
import { JSONFilePreset } from "lowdb/node";
import cookieParser from "cookie-parser";
// import { CalendarAttributes } from "@vocaloid-birthday/common";
import { authMiddleware } from "./authMiddleware";
import { v4 as uuidv4 } from "uuid";
import type { AdminData } from "./type";
import fs from "fs/promises";
import dayjs from "dayjs";

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.set("port", process.env.PORT || port);

const REFRESH_COOKIE_KEY = "VocalendarRefreshToken";

type RefreshTokenData = {
  refreshTokens: string[];
};

const defaultData: RefreshTokenData = { refreshTokens: [] };
const file = join(process.cwd(), "db.json");
let refreshTokenDB: Low<RefreshTokenData>;

app.get("/api/songs", async (req: Request, res: Response) => {
  const { month, date } = req.query as { month: string; date: string };
  console.log(req.query);
  const monthString = month.padStart(2, "0");
  const condition = [
    where(fn("strftime", "%m", col("Song.publishDate")), monthString),
  ];

  if (parseInt(date) !== 0) {
    const dateString = date.padStart(2, "0");
    condition.push(
      where(fn("strftime", "%d", col("Song.publishDate")), dateString)
    );
  }

  try {
    const dbResult = await Song.findAll({
      where: {
        [Op.and]: condition,
      },
      group: ["vocaDBId"], // 중복 제거
      include: [
        {
          model: PV,
          required: true, // inner join하려면 true로 변경
        },
      ],
      order: [["vocaDBRating", "DESC"]],
    });

    res.status(200).json(dbResult);
  } catch (error) {
    console.error("데이터를 검색하던 중 에러가 발생했습니다.");
    console.error(error);
    res
      .status(500)
      .json({ message: "데이터를 검색하던 중 에러가 발생했습니다." });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { password } = req.body;
  const hashedPassword = process.env.HASHED_PASSWORD;
  console.log(hashedPassword);
  const isMatch = await bcrypt.compare(password, hashedPassword!);

  if (isMatch) {
    // Access, Refresh Token 생성
    const accessToken = jwt.sign(
      { isAdmin: true } as AdminData,
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { isAdmin: true } as AdminData,
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    // Refrsh는 쿠키로, Access는 json으로 반환
    res.cookie(REFRESH_COOKIE_KEY, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });

    refreshTokenDB.data.refreshTokens.push(refreshToken);
    await refreshTokenDB.write();
  } else {
    res.status(401).json({ message: "비밀번호가 올바르지 않습니다" });
  }
});

app.post("/api/auth/refresh", async (req, res) => {
  const refreshToken = req.cookies[REFRESH_COOKIE_KEY];

  if (!refreshToken) return res.status(401).send("Refresh Token이 없습니다.");
  refreshTokenDB.read();
  const tokenList = refreshTokenDB.data.refreshTokens;
  if (refreshToken in tokenList)
    return res.status(403).send("유효하지 않은 refresh token입니다.");

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
    (err: Error | null, payload: any) => {
      if (err)
        return res.status(403).send("유효하지 않은 refresh token입니다.");

      const newAccessToken = jwt.sign(
        { isAdmin: true } as AdminData,
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );
      res.json({ accessToken: newAccessToken });
    }
  );
});

app.post("/api/logout", async (req, res) => {
  const refreshToken = req.cookies[REFRESH_COOKIE_KEY];
  if (!refreshToken) {
    return res.status(204).send("이미 로그아웃된 상태입니다");
  }
  try {
    const tokenList = refreshTokenDB.data.refreshTokens;
    tokenList.filter((value) => value !== refreshToken);

    refreshTokenDB.data.refreshTokens = [];
    await refreshTokenDB.write();

    // 사용자의 쿠키도 삭제
    res.clearCookie(REFRESH_COOKIE_KEY, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "로그아웃 되었습니다" });
  } catch (error) {
    console.error("로그아웃 처리 중 오류:", error);
    return res.status(500).json({
      message: "로그아웃 처리 중 오류가 발생했습니다. 다시 시도해주세요",
    });
  }
});

type CalendarData = {
  title: string;
  composer: string;
  titleKor: string;
  composerKor: string;
  publishDate?: Date;
  calendarDate: Date;
  lyrics: string;
  svgConfig: object;
  songId?: number;
  svgData: string;
};

app.post("/api/admin/save-data", authMiddleware, async (req, res) => {
  const { data } = req.body as { data: CalendarData };
  console.log("SVG 데이터 수신:", data);
  const svgStorageDir = join(process.cwd(), "..", "database", "svg");
  const svgFileName = `${uuidv4()}.svg`;
  const svgFilePath = join(svgStorageDir, svgFileName);
  console.log(svgFilePath);

  try {
    await fs.mkdir(svgStorageDir, { recursive: true });
    await fs.writeFile(svgFilePath, data.svgData, { encoding: "utf-8" });

    await Calendar.create({
      title: data.title,
      composer: data.composer,
      titleKor: data.titleKor,
      composerKor: data.composerKor,
      publishDate: data.publishDate,
      calendarDate: data.calendarDate,
      lyrics: data.lyrics,
      svgConfig: data.svgConfig,
      svgFileName: svgFileName,
      songId: data.songId,
    });

    return res
      .status(200)
      .json({ message: "데이터가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("데이터 저장 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "데이터 저장 중 오류가 발생했습니다." });
  }
});

app.get("/api/progress", async (req: Request, res: Response) => {
  const { month } = req.query as { month: string };
  const monthString = month.padStart(2, "0");

  try {
    const result = await Calendar.findAll({
      where: where(
        fn("strftime", "%Y-%m", col("calendarDate")),
        `2026-${monthString}`
      ),
      order: [["calendarDate", "ASC"]],
    });

    const daysInMonth = dayjs(`2026-${monthString}-01`).daysInMonth();

    const monthProgressArray = new Array(daysInMonth).fill(false);
    result.forEach((calendarItem) => {
      const date = dayjs(calendarItem.calendarDate).date();
      monthProgressArray[date - 1] = true;
    });

    return res.status(200).json({
      progress: monthProgressArray,
    });
  } catch (error) {
    console.error("데이터를 검색하던 중 에러가 발생했습니다.");
    return res
      .status(500)
      .json({ message: "데이터를 검색하던 중 에러가 발생했습니다." });
  }
});

const startServer = async () => {
  await connectDatabase({ debug: false });
  refreshTokenDB = await JSONFilePreset(file, defaultData);
  app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중!");
  });
};

startServer();
