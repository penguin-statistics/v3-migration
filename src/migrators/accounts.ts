import { Migrator } from "./index"
import { MUserModel } from "../models/mongo/user"
import { PAccount } from "../models/postgresql/account"
import { createPBar } from '../utils/pbar';

const accountMigrator: Migrator = async () => {
  console.log('[Migrator] [Account] Fetching records...');
  const accounts = await MUserModel.find({}).exec()

  console.log(`[Migrator] [Account] Migrating ${accounts.length} records`)
  const BAR = createPBar('Account', accounts.length)

  let filteredAccounts = accounts.map(account => {
    const i = account.toJSON() as any
    BAR.tick()
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
