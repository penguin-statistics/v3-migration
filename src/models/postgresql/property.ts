import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";

export const PProperty = sequelize.define('property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT(),
    allowNull: false
  },
}, {
  timestamps: false
})
