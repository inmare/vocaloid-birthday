import { CalendarAttributes } from "@vocaloid-birthday/common";
import { Calendar, Song } from "@vocaloid-birthday/database";
import { Request, Response } from "express";
import fs from "fs/promises";
import { CalendarData } from "../types";

export default async function saveSvg(req: Request, res: Response) {
  if (!req.files) {
    return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
  }

  // 업로드된 파일과 데이터 추출
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const svgFile = files.svgFile ? files.svgFile[0] : null;
  const imageFile = files.imageFile ? files.imageFile[0] : null;
  const data = JSON.parse(req.body.data) as CalendarData;

  if (!svgFile) {
    return res
      .status(400)
      .json({ message: "SVG 파일이 업로드되지 않았습니다." });
  }

  const svgFileName = svgFile.filename;
  const imageFileName = imageFile ? imageFile.filename : null;

  try {
    const songData = await Song.findByPk(data.songId);
    if (!songData) {
      // 노래를 찾을 수 없으면 업로드된 파일 삭제
      await fs.unlink(svgFileName);
      if (imageFile) fs.unlink(imageFileName!);
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
      imageFileName: imageFileName,
      songId: songData.id,
    } as CalendarAttributes;

    if (calendarSong) {
      // 기존 파일 삭제
      await fs.unlink(calendarSong.svgFileName);
      if (calendarSong.imageFileName && imageFile) {
        await fs.unlink(calendarSong.imageFileName);
      }
      calendarSong.update(dbData);
    } else {
      await Calendar.create({ ...dbData });
    }

    return res
      .status(200)
      .json({ message: "데이터가 성공적으로 저장되었습니다." });
  } catch (error) {
    // 이미 업로드 된 파일 삭제
    await fs.unlink(svgFileName);
    if (imageFile) fs.unlink(imageFileName!);
    console.error("데이터 저장 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "데이터 저장 중 오류가 발생했습니다." });
  }
}
