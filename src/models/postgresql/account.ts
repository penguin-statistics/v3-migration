import { DataTypes } from 'sequelize'
import sequelize from '../../utils/postgresql'

export const PAccount = sequelize.define(
  'account',
  {
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    penguinId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING(32)),
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['penguin_id'],
      },
      {
        fields: ['tags'],
        using: 'gin',
      },
    ],
  },
)
