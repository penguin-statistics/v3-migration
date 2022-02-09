import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { PAccount } from './account'
import { server } from './common'
import { PDropPattern } from './drop_pattern'
import { PStage } from './stage'

export const PDropReport = sequelize.define(
  'drop_report',
  {
    reportId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: false,
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
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: PDropPattern,
        key: 'pattern_id',
      },
    },
    times: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reliability: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    server,
    accountId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: PAccount,
        key: 'account_id',
      },
    },
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
        fields: ['created_at'],
      },
      {
        fields: ['reliability'],
      },
      {
        fields: ['server'],
      },
      {
        fields: ['account_id'],
      },
    ],
  },
)
