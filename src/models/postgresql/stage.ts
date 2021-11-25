import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { existence } from "./common";
import { PZone } from "./zone";

export const PStage = sequelize.define('stage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  stageId: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PZone,
      key: 'id'
    }
  },
  code: {
    type: DataTypes.JSON,
    allowNull: false
  },
  sanity: {
    type: DataTypes.INTEGER,
  },
  existence,
  minClearTime: {
    type: DataTypes.INTEGER,
  }
}, {
  timestamps: false,
  underscored: true
})
