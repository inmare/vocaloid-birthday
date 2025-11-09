import { DataTypes, Model, Sequelize } from "sequelize";

export class Calendar extends Model {
  declare id: number;
  declare title?: string;
  declare composer?: string;
  declare titleKor?: string;
  declare composerKor?: string;
  declare publishDate: Date;
  declare calendarDate: Date;
  declare lyrics?: string;
  declare svgConfig: object;
  declare svgFileName: string;
  declare imageFileName?: string;
  declare songId: number;
}

export const InitCalendarModel = (sequelize: Sequelize) => {
  Calendar.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      composer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      titleKor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      composerKor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publishDate: {
        type: DataTypes.DATE,
      },
      calendarDate: {
        type: DataTypes.DATE,
      },
      lyrics: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      svgConfig: {
        type: DataTypes.JSON,
      },
      svgFileName: {
        type: DataTypes.STRING,
      },
      imageFileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      songId: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, freezeTableName: true }
  );

  return Calendar;
};
