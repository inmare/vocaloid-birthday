import { Calendar, PV } from "@vocaloid-birthday/database";
import { Request, Response } from "express";
import { col, fn, Op, where } from "sequelize";

export default async function calendarData(req: Request, res: Response) {
  const { month, date } = req.query as { month: string; date: string };
  const monthString = month.padStart(2, "0");
  const dateString = date.padStart(2, "0");

  try {
    const dbResult = await Calendar.findOne({
      where: where(
        fn("strftime", "%m-%d", col("calendarDate")),
        `${monthString}-${dateString}`
      ),
    });

    if (dbResult === null) res.status(200).json(null);
    else res.status(200).json(dbResult);
  } catch (error) {
    console.error("데이터를 검색하던 중 에러가 발생했습니다.");
    console.error(error);
    res
      .status(500)
      .json({ message: "데이터를 검색하던 중 에러가 발생했습니다." });
  }
}
