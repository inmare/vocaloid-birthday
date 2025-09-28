import { Sequelize, DataTypes, Model } from "sequelize";
import { PVAttributes } from "@vocaloid-birthday/common";

export class PV extends Model<PVAttributes> implements PVAttributes {
  declare id: number;
  declare songId: number;
  declare pvId: string;
  declare service: string;
}

export const InitPVModel = (sequelize: Sequelize) => {
  PV.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      songId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pvId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  return PV;
};
