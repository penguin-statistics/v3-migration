import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { existence } from "./common";

export const PActivity = sequelize.define('activity', {
  activityId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
  },
  name: {
    type: DataTypes.JSON,
    allowNull: false
  },
  /** name: I18nMap */
  existence,
}, {
  timestamps: false,
  underscored: true
})
