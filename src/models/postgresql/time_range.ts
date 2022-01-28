import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { server } from './common'

export const PTimeRange = sequelize.define(
  'time_range',
  {
    rangeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(64),
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT(),
    },
    server,
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['server'],
      },
    ],
  },
)
