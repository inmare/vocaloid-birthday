import { Sequelize } from "sequelize";
import path from "path";

import { DB_FILE_NAME } from "@vocaloid-birthday/common";
import { InitSongModel } from "./song.model";
import { InitPVModel } from "./pv.model";

export const DB_PATH = path.join(__dirname, "..", DB_FILE_NAME);

// sqlite 데이터베이스 인스턴스 생성
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH, // 파일이 저장될 경로 설정
  logging: false, // 콘솔에 쿼리 로그를 출력하지 않음
});

// Song 모델 초기화
export const Song = InitSongModel(sequelize);

// PV 모델 초기화
export const PV = InitPVModel(sequelize);

// One to many 관계 정의
Song.hasMany(PV, {
  foreignKey: "songId",
  constraints: true,
  onDelete: "cascade",
});
PV.belongsTo(Song, {
  foreignKey: "songId",
});

// 데이터베이스와 모델 동기화
export const connectDatabase = async ({ debug }: { debug: boolean }) => {
  try {
    console.log("데이터 베이스에 연결 시도 중...");
    console.log(`경로: ${DB_PATH}`);
    // production에서는 alter: true 지우기
    await sequelize.sync(debug ? { alter: true } : {});
    console.log("데이터 베이스 연결 성공");
  } catch (error) {
    console.error("데이터 베이스에 접속할 수 없습니다");
    console.error(error);
  }
};
