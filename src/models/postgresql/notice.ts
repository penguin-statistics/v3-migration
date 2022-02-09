import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'
import { existence } from './common'

export const PNotice = sequelize.define(
  'notice',
  {
    noticeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    existence: {
      type: DataTypes.JSONB,
    },
    severity: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
  },
)
