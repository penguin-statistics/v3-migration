import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { existence } from "./common";

export const PItem = sequelize.define('item', {
  itemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  arkItemId: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
  },
  existence,
  /** name: I18nMap */
  name: {
    type: DataTypes.JSON,
    allowNull: false
  },
  sortId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rarity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(16),
  },
  group: {
    type: DataTypes.STRING(16),
  },
  sprite: {
    type: DataTypes.STRING(16)
  },
  keywords: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['ark_item_id'],
    },
    {
      fields: ['group'],
      using: 'hash'
    },
  ],
})
