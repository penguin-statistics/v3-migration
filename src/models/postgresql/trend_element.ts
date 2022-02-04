import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { server } from './common'
import { PStage } from './stage'
import { PItem } from './item'

export const PTrendElement = sequelize.define(
  'trend_element',
  {
    elementId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PStage,
        key: 'stage_id',
      },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PItem,
        key: 'item_id',
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    times: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    server,
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['stage_id'],
      },
      {
        fields: ['item_id'],
      },
      {
        fields: ['start_time'],
      },
      {
        fields: ['server'],
      },
    ],
  },
)
