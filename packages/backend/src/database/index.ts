import { Sequelize } from "sequelize";
import { VideoFactory } from "./video.model";

// sqlite 데이터베이스 인스턴스 생성
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite", // 파일이 저장될 경로 설정
  logging: false, // 콘솔에 쿼리 로그를 출력하지 않음
});

// Video 모델 초기화
export const Video = VideoFactory(sequelize);

// 데이터베이스와 모델 동기화
export const connectDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("[database]: 데이터 베이스 연결 성공");
  } catch (error) {
    console.error("[database]: 데이터 베이스에 접속할 수 없습니다: ", error);
  }
};
