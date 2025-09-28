import { Sequelize, DataTypes, Model } from "sequelize";
import { SongAttributes } from "@vocaloid-birthday/common";

export class Song extends Model<SongAttributes> implements SongAttributes {
  declare id: number;
  declare title: string;
  declare composer: string;
  declare publishDate: Date;
  declare vocaDBId?: number;
  declare vocaDBRating?: number;
  declare titleKr?: string;
  declare composerKr?: string;
  declare lyrics?: string;
}

export const InitSongModel = (sequelize: Sequelize) => {
  Song.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      composer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publishDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      vocaDBId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      vocaDBRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      titleKr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      composerKr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lyrics: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    { sequelize }
  );

  return Song;
};
