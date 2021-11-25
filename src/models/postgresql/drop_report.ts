import { DataTypes } from "sequelize";
import sequelize from "../../utils/postgresql";
import { PAccount } from "./account";
import { server } from "./common";
import { PDropPattern } from "./drop_pattern";
import { PStage } from "./stage";

export const PDropReport = sequelize.define('drop_report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  stageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PStage,
      key: 'id'
    }
  },
  patternId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PDropPattern,
      key: 'id'
    }
  },
  times: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ip: {
    type: DataTypes.CIDR,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  server,
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PAccount,
      key: 'id'
    }
  }
}, {
  timestamps: false,
  underscored: true,
  indexes: [
    {
      fields: ['stage_id'],
    },
    {
      fields: ['pattern_id'],
    },
    {
      fields: ['created_at'],
    },
    {
      fields: ['deleted'],
    },
    {
      fields: ['server'],
    },
    {
      fields: ['account_id'],
    },
  ],
})
