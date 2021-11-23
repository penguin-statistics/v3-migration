import { DataTypes } from "sequelize";

export const existence = {
  type: DataTypes.JSON,
  allowNull: false,
}

export const server = {
  type: DataTypes.ENUM('CN', 'US', 'JP', 'KR'),
  allowNull: false,
}

export const dropType = {
  type: DataTypes.ENUM('REGULAR', 'SPECIAL', 'EXTRA', 'FURNITURE', 'RECOGNITION_ONLY'),
  allowNull: false,
}
