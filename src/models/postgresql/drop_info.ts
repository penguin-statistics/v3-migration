import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { dropType, server } from "./common";
import { PItem } from "./item";
import { PStage } from "./stage";
import { PTimeRange } from "./time_range";

export const PDropInfo = sequelize.define(
  "drop_info",
  {
    dropId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    server,
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
      references: {
        model: PItem,
        key: "item_id",
      },
    },
    dropType,
    timeRangeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PTimeRange,
        key: "range_id",
      },
    },
    bounds: {
      type: DataTypes.JSON,
    },
    accumulable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['server']
      },
      {
        fields: ['stage_id']
      },
      {
        fields: ['drop_type']
      },
      {
        fields: ['time_range_id']
      }
    ]
  }
);
