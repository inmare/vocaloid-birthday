import { Request, Response } from "express";
import { Calendar } from "@vocaloid-birthday/database";
import dayjs from "dayjs";
import { col, fn, where } from "sequelize";

export default async function progress(req: Request, res: Response) {
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
}
