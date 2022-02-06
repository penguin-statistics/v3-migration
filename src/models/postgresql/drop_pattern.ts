import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'

export const PDropPattern = sequelize.define(
  'drop_pattern',
  {
    patternId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['hash'],
        unique: true,
      },
    ],
  },
)
