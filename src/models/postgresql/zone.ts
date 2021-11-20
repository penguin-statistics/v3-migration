import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { existence } from "./common";

export const PZone = sequelize.define('zone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  zoneId: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(64),
  },
  name: {
    type: DataTypes.JSON,
    allowNull: false
  },
  existence,
  /** name: I18nMap */
  background: {
    type: DataTypes.STRING(128),
  }
}, {
  timestamps: false
})
