import express, { type Express, Request, Response } from "express";
import cors from "cors";
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

app.post("/api/songs", async (req: Request, res: Response) => {
  const { month, date } = req.body;
  const monthString = String(month).padStart(2, "0");
  const condition = [
    where(fn("strftime", "%m", col("Song.publishDate")), monthString),
  ];

  if (date !== 0) {
    const dateString = String(date).padStart(2, "0");
    condition.push(
      where(fn("strftime", "%d", col("Song.publishDate")), dateString)
    );
  }

  try {
    const songList = await Song.findAll({
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

    res.status(200).json(songList);
  } catch (error) {
    console.error("데이터를 검색하던 중 에러가 발생했습니다.");
    console.error(error);
    res
      .status(500)
      .json({ message: "데이터를 검색하던 중 에러가 발생했습니다." });
  }
});

const startServer = async () => {
  await connectDatabase({ debug: false });
  app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중!");
  });
};

startServer();
