import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { server } from "./common";
import { PStage } from "./stage";
import { PItem } from './item';
import { PTimeRange } from './time_range';

export const PDropMatrixElement = sequelize.define(
  "drop_matrix_element",
  {
    elementId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PStage,
        key: "stage_id",
      },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PItem,
        key: "item_id",
      },
    },
    rangeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PTimeRange,
        key: "range_id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    times: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    server
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ["stage_id"],
      },
      {
        fields: ["item_id"],
      },
      {
        fields: ["range_id"],
      },
      {
        fields: ["server"],
      },
    ],
  }
);
