import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { server } from './common'
import { PStage } from './stage'
import { PTimeRange } from './time_range'
import { PDropPattern } from './drop_pattern'

export const PPatternMatrixElement = sequelize.define(
  'pattern_matrix_element',
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
    patternId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PDropPattern,
        key: 'pattern_id',
      },
    },
    rangeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PTimeRange,
        key: 'range_id',
      },
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
        fields: ['pattern_id'],
      },
      {
        fields: ['range_id'],
      },
      {
        fields: ['server'],
      },
    ],
  },
)
