import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { existence } from './common'

export const PActivity = sequelize.define(
  'activity',
  {
    activityId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    /** name: I18nMap */
    existence,
  },
  {
    timestamps: false,
    underscored: true,
  },
)
