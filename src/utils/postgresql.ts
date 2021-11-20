import { Sequelize } from "sequelize";

const sequelize = new Sequelize('postgres://root:root@127.0.0.1:5432/penguin_structured', {
  logging: false
})

export default sequelize
