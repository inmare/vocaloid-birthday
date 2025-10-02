import {
  connectDatabase,
  Song,
  PV,
  sequelize,
} from "@vocaloid-birthday/database";
import { correctPublishDate } from "../crawling/vocaDBApi";
import dayjs from "dayjs";
import dotenv from "dotenv";

(async () => {
  await connectDatabase({ debug: false });
  dotenv.config();

  // get the last id of song table
  const lastSong = await Song.findOne({
    order: [["id", "DESC"]],
  });
  const lastSongId = lastSong?.id || 0;
  let currentSongId = 1;
  const BATCH_SIZE = 1000;
  let transaction = await sequelize.transaction();
  let errorOccurred = false;

  while (true) {
    try {
      if (currentSongId > lastSongId) {
        console.log("모든 PV 데이터를 순회 했습니다.");
        break;
      }

      const pvs = await PV.findAll({
        where: { songId: currentSongId },
        order: [["id", "DESC"]],
      });

      console.log("곡 ID:", currentSongId, "의 PV 데이터를 검사하는 중입니다.");

      // 각 PV의 publishDate 수정
      const datePromises = pvs.map((pv) => correctPublishDate(pv));
      const publishDates = await Promise.all(datePromises);

      // publishDate가 올바른 형식인 경우에만 dateArray에 추가
      const updaetDatePromises = pvs.map((pv, index) => {
        const publishDate = publishDates[index] || "";
        const date = dayjs(publishDate);
        if (date.isValid()) {
          return pv.update(
            { publishDate: new Date(publishDate) },
            { transaction }
          );
        }
        return Promise.resolve();
      });
      await Promise.all(updaetDatePromises);

      const dayjsDates = publishDates
        .map((date) => dayjs(date))
        .filter((date) => date.isValid());

      // 가장 빠른 날짜로 Song의 publishDate 수정
      if (publishDates.length > 0) {
        const earliestDate = dayjsDates.reduce((prev, curr) => {
          if (prev.isBefore(curr)) return prev;
          else return curr;
        });
        const song = await Song.findByPk(currentSongId);
        const originalDate = dayjs(song?.publishDate);
        // isSame으로 비교하는 경우에는 날짜간에 차이가 발생하는 경우가 있어서
        // YYYY-MM-DD형식으로 변환해서 비교
        const dateIsSame =
          originalDate.format("YYYY-MM-DD") ===
          earliestDate.format("YYYY-MM-DD");
        if (song && !dateIsSame) {
          // 변경된 경우에만 데이터를 업데이트 하고 로그 출력
          // 저장할 때도 마찬가지로 YYYY-MM-DD형식으로 변환해서 저장
          await song.update(
            { publishDate: new Date(earliestDate.format("YYYY-MM-DD")) },
            { transaction }
          );
          console.log(
            "곡 ID:",
            song.id,
            "의 발매일을",
            originalDate.format("YYYY-MM-DD"),
            "에서",
            earliestDate.format("YYYY-MM-DD"),
            "로 수정했습니다."
          );
        }
      }

      if (currentSongId % BATCH_SIZE === 0) {
        await transaction.commit();
        console.log(
          `${currentSongId}개의 곡에 대해서 작업을 완료했습니다. 데이터베이스에 변경사항을 저장합니다.`
        );

        // 새로운 트랜잭션 시작
        transaction = await sequelize.transaction();
        console.log("새로운 트랜잭션을 시작합니다.");
      }

      currentSongId += 1;
    } catch (error) {
      console.error(
        "곡 ID:",
        currentSongId,
        "의 데이터를 처리하던 중 오류가 발생했습니다."
      );
      console.error(error);
      await transaction.rollback();
      console.log("트랜잭션을 롤백합니다.");
      errorOccurred = true;
      break;
    }
  }

  if (!errorOccurred) await transaction.commit();
  sequelize.close();
})();
