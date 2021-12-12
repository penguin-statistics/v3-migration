import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { PDropPattern } from "./drop_pattern";
import { PItem } from "./item";

export const PDropPatternElement = sequelize.define('drop_pattern_element', {
  elementId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dropPatternId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PDropPattern,
      key: 'pattern_id'
    }
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PItem,
      key: 'item_id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['drop_pattern_id'],
    },
  ],
})
