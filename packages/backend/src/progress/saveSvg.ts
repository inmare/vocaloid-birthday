import { CalendarAttributes } from "@vocaloid-birthday/common";
import { Calendar, Song } from "@vocaloid-birthday/database";
import { Request, Response } from "express";
import fs from "fs/promises";
import { CalendarData } from "../type";

export default async function saveSvg(req: Request, res: Response) {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "SVG 파일이 업로드되지 않았습니다." });
  }

  const svgFileName = req.file.filename;
  const data = JSON.parse(req.body.data) as CalendarData;

  try {
    const songData = await Song.findByPk(data.songId);
    if (!songData) {
      await fs.unlink(svgFileName);
      return res
        .status(404)
        .json({ message: "해당 ID의 곡을 찾을 수 없습니다." });
    }

    const calendarSong = await Calendar.findOne({
      where: { calendarDate: data.calendarDate },
    });

    const dbData = {
      title: data.title,
      composer: data.composer,
      titleKor: data.titleKor,
      composerKor: data.composerKor,
      publishDate: songData.publishDate,
      calendarDate: data.calendarDate,
      lyrics: data.lyrics,
      svgConfig: data.svgConfig,
      svgFileName: svgFileName,
      songId: songData.id,
    } as CalendarAttributes;

    if (calendarSong) {
      calendarSong.update(dbData);
    } else {
      await Calendar.create({ ...dbData });
    }

    return res
      .status(200)
      .json({ message: "데이터가 성공적으로 저장되었습니다." });
  } catch (error) {
    await fs.unlink(svgFileName);
    console.error("데이터 저장 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "데이터 저장 중 오류가 발생했습니다." });
  }
}
