import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { existence } from './common'

export const PZone = sequelize.define(
  'zone',
  {
    zoneId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    arkZoneId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(64),
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    existence,
    /** name: I18nMap */
    background: {
      type: DataTypes.STRING(128),
    },
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['ark_zone_id'],
      },
    ],
  },
)
