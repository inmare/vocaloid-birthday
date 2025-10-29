import { DataTypes, Model, Sequelize } from "sequelize";

export class SvgData extends Model {
  declare id: number;
  declare text: string;
}

export const InitSvgDataModel = (sequelize: Sequelize) => {
  SvgData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    { sequelize }
  );

  return SvgData;
};
