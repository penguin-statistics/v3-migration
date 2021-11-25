import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";

export const PDropPattern = sequelize.define('drop_pattern', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hash: {
    type: DataTypes.STRING(64),
    allowNull: false,
  }
}, {
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['hash']
    }
  ]
})
