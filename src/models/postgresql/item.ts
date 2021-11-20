import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { existence } from "./common";

export const PItem = sequelize.define('item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  itemId: {
    type: DataTypes.STRING(32),
    allowNull: false
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
  timestamps: false
})
