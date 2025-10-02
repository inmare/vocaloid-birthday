import {
  connectDatabase,
  Song,
  PV,
  sequelize,
} from "@vocaloid-birthday/database";
import { createSongInfo } from "../crawling/vocaDBApi";
import dotenv from "dotenv";
import miku from "../miku";
import dayjs from "dayjs";

dotenv.config();

(async () => {
  const debug = false;
  await connectDatabase({ debug });
  const transaction = await sequelize.transaction();

  try {
    // id가 1~1999인 곡들에 대해서만 작업 수행
    for (let i = 1; i < 2000; i++) {
      const song = await Song.findOne({ where: { id: i } });
      if (!song) continue;

      const vocaDBId = song.vocaDBId;
      if (!vocaDBId) continue;

      const songInfo = await createSongInfo(vocaDBId);

      for (const pvData of songInfo.pvs) {
        // 이미 존재하는 PV인지 확인
        const existingPV = await PV.findOne({
          where: { pvId: pvData.pvId, songId: song.id },
        });
        if (existingPV) continue;
        // 트랜잭션에 pv 포함
        await PV.create(
          {
            pvId: pvData.pvId,
            service: pvData.service,
            songId: song.id,
            publishDate: new Date(0), // 임시로 1970-01-01로 설정, 나중에 수정 필요
          },
          { transaction }
        );
        console.log("곡 ID:", song.id, "에 PV를 추가했습니다.", pvData.pvId);
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("데이터 업데이트 도중 오류가 발생했습니다.");
    console.error(error);
  } finally {
    sequelize.close();
    miku();
    console.log("데이터 업데이트 작업이 완료되었습니다.");
  }
})();
