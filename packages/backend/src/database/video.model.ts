import { Sequelize, DataTypes, Model } from "sequelize";
import { VideoAttributes } from "@vocaloid-birthday/common";

// 모델 클래스 정의
export class Video extends Model<VideoAttributes> implements VideoAttributes {
  public id!: number;
  public url!: string;
  public uploadDate!: string;
  public videoId!: string;
}

// 모델 초기화 및 Sequelize 인스턴스와 연결
export const VideoFactory = (sequelize: Sequelize) => {
  Video.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploadDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      videoId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "videos",
    }
  );

  return Video;
};
