import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { existence } from "./common";

export const PNotice = sequelize.define('notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conditions: {
    type: DataTypes.JSON,
  },
  existence,
  severity: {
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false
  },
}, {
  timestamps: false
})
