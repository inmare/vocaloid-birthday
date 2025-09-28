import express, { type Express, Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { connectDatabase, Song, PV } from "@vocaloid-birthday/database";
import { Op, fn, col, where } from "sequelize";

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.set("port", process.env.PORT || port);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

function extractVideoId(url: string): string | null {
  const regex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regex);
  if (match) {
    const result = match[1] ? match[1] : null;
    return result;
  }
  return null;
}

app.post("/api/birthday", async (req: Request, res: Response) => {
  const { month, date } = req.body;
  const monthString = String(month).padStart(2, "0");
  const dateString = String(date).padStart(2, "0");

  try {
    const songList = await Song.findAll({
      where: {
        [Op.and]: [
          where(fn("strftime", "%m", col("publishDate")), monthString),
          where(fn("strftime", "%d", col("publishDate")), dateString),
        ],
      },
    });
    console.log(songList);

    res.status(200).json(songList);
  } catch (error) {
    console.error("데이터를 검색하던 중 에러가 발생했습니다.");
    console.error(error);
    res
      .status(500)
      .json({ message: "데이터를 검색하던 중 에러가 발생했습니다." });
  }
});

app.post("/api/greet", (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "이름을 보내주세요" });
  }

  console.log(`클라이언트로부터 받은 이름: ${name}`);
  const message = `안녕하세요, ${name}님! 서버에서 보낸 메세지입니다.`;
  res.status(200).json({ responseMessage: message });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중!");
});

const startServer = async () => {
  await connectDatabase({ debug: true });
  app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 시작되었습니다.`);
  });
};

startServer();
