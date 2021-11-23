import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { server } from "./common";

export const PTimeRange = sequelize.define('time_range', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(64),
  },
  startTime: {
    type: DataTypes.DATE,
  },
  endTime: {
    type: DataTypes.DATE,
  },
  comment: {
    type: DataTypes.TEXT(),
  },
  server
}, {
  timestamps: false
})
