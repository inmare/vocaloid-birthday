import { Request, Response } from "express";
import { Op, fn, col, where } from "sequelize";
import { Song, PV } from "@vocaloid-birthday/database";

export default async function song(req: Request, res: Response) {
  const { month, date } = req.query as { month: string; date: string };
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
}
