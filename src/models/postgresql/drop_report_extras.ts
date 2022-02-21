import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'

export const PDropReportExtras = sequelize.define(
  'drop_report_extras',
  {
    reportId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.CIDR,
      allowNull: false,
    },
    sourceName: {
      type: DataTypes.STRING(128),
    },
    version: {
      type: DataTypes.STRING(128),
    },
    metadata: {
      type: DataTypes.JSONB,
    },
    md5: {
      type: DataTypes.STRING(32),
    },
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['ip'],
      },
      {
        fields: ['source_name'],
      },
      {
        fields: ['version'],
      },
      {
        fields: ['md5'],
      },
    ],
  },
)
