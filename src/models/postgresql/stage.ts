import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { existence } from './common'
import { PZone } from './zone'

export const PStage = sequelize.define(
  'stage',
  {
    stageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    arkStageId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    stageType: {
      type: DataTypes.ENUM('MAIN', 'SUB', 'ACTIVITY', 'DAILY'),
    },
    zoneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PZone,
        key: 'zone_id',
      },
    },
    extraProcessType: {
      type: DataTypes.ENUM('GACHABOX'),
    },
    code: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    sanity: {
      type: DataTypes.INTEGER,
    },
    existence,
    minClearTime: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['ark_stage_id'],
      },
      {
        fields: ['zone_id'],
      },
    ],
  },
)
