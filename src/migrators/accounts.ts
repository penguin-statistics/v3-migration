import { Migrator } from "./index"
import { MUserModel } from "../models/mongo/user"
import { PAccount } from "../models/postgresql/account"

const accountMigrator: Migrator = async () => {
  const accounts = await MUserModel.find({}).exec()

  console.log(`[Migrator] [Account] Migrating ${accounts.length} records`)

  let filteredAccounts = accounts.map(account => {
    const i = account.toJSON() as any
    if (i.userID === 'spring-test') {
      return null;
    }
    return {
      penguinId: i.userID,
      weight: i.weight,
      tags: i.tags,
      createdAt: i.createTime,
    };
  }).filter(account => account !== null);

  await PAccount.bulkCreate(filteredAccounts);

  console.log(`[Migrator] [Account] Finished migrating ${filteredAccounts.length} records`)
}

export default accountMigrator
