import { DataTypes, Model, Sequelize } from "sequelize";

export class Calendar extends Model {
  declare id: number;
  declare title: string;
  declare composer: string;
  declare titleKor: string;
  declare composerKor: string;
  declare publishDate: Date;
  declare calendarDate: Date;
  declare lyrics: string;
  declare svgConfig: object;
  declare svgFileName: string;
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
      },
      composer: {
        type: DataTypes.STRING,
      },
      titleKor: {
        type: DataTypes.STRING,
      },
      composerKor: {
        type: DataTypes.STRING,
      },
      publishDate: {
        type: DataTypes.DATE,
      },
      calendarDate: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.DATE,
      },
      lyrics: {
        type: DataTypes.STRING,
      },
      svgConfig: {
        type: DataTypes.JSON,
      },
      svgFileName: {
        type: DataTypes.STRING,
      },
      songId: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, freezeTableName: true }
  );

  return Calendar;
};
