import { DataTypes } from "sequelize";

export const existence = {
  type: DataTypes.JSON,
  allowNull: false,
}

export const server = {
  type: DataTypes.ENUM('CN', 'US', 'JP', 'KR'),
  allowNull: false,
}
