import {
  CalendarAttributes,
  CalendarPostAttributes,
} from "@vocaloid-birthday/common";
import { Calendar, Song } from "@vocaloid-birthday/database";
import { Request, Response } from "express";
import fs from "fs/promises";
import { join } from "path";
import { staticFolder } from "../constants";
import { col, fn, where } from "sequelize";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default async function saveSvg(req: Request, res: Response) {
  if (!req.files) {
    return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
  }

  // 업로드된 파일과 데이터 추출
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const svgFile = files.svgFile ? files.svgFile[0] : null;
  const imageFile = files.imageFile ? files.imageFile[0] : null;
  const data = JSON.parse(req.body.data) as CalendarPostAttributes;

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
      const svgFilePath = join(staticFolder, svgFileName);
      await fs.rm(svgFilePath, { force: true });
      if (imageFile) {
        const imageFilePath = join(staticFolder, imageFileName!);
        await fs.rm(imageFilePath, { force: true });
      }
      return res
        .status(404)
        .json({ message: "해당 ID의 곡을 찾을 수 없습니다." });
    }

    const dayjsDate = dayjs.utc(data.calendarDate);
    const dateString = dayjsDate.format("MM-DD");

    const calendarSong = await Calendar.findOne({
      where: where(fn("strftime", "%m-%d", col("calendarDate")), dateString),
    });

    // DB에 저장할 데이터 구성
    // 기존에 값이 존재하더라도 새로 받은 데이터에 값이 없으면 null로 저장
    const dbData = {
      title: data.title ? data.title : null,
      composer: data.composer ? data.composer : null,
      titleKor: data.titleKor ? data.titleKor : null,
      composerKor: data.composerKor ? data.composerKor : null,
      publishDate: songData.publishDate,
      calendarDate: data.calendarDate,
      lyrics: data.lyrics ? data.lyrics : null,
      svgConfig: data.svgConfig,
      svgFileName: svgFileName,
      songId: songData.id,
    } as CalendarAttributes;

    if (imageFileName) {
      dbData.imageFileName = imageFileName;
    }

    if (calendarSong) {
      // 기존 파일 삭제
      const svgFilePath = join(staticFolder, calendarSong.svgFileName);
      await fs.rm(svgFilePath, { force: true });
      if (calendarSong.imageFileName && imageFile) {
        const imageFilePath = join(staticFolder, calendarSong.imageFileName);
        await fs.rm(imageFilePath, { force: true });
      }
      await calendarSong.update(dbData);
    } else {
      await Calendar.create({ ...dbData });
    }

    return res
      .status(200)
      .json({ message: "데이터가 성공적으로 저장되었습니다." });
  } catch (error) {
    // 이미 업로드 된 파일 삭제
    const svgFilePath = join(staticFolder, svgFileName);
    await fs.rm(svgFilePath, { force: true });
    if (imageFile) {
      const imageFilePath = join(staticFolder, imageFileName!);
      await fs.rm(imageFilePath, { force: true });
    }
    console.error("데이터 저장 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "데이터 저장 중 오류가 발생했습니다." });
  }
}
