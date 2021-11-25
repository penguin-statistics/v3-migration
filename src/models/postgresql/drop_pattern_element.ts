import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { PDropPattern } from "./drop_pattern";
import { PItem } from "./item";

export const PDropPatternElement = sequelize.define('drop_pattern_element', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dropPatternId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PDropPattern,
      key: 'id'
    }
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PItem,
      key: 'id'
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
