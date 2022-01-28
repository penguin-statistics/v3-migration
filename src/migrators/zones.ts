import { Migrator } from './index'
import { MZoneModel } from '../models/mongo/zone'
import { PZone } from '../models/postgresql/zone'
import { createPBar } from '../utils/pbar'

const zoneMigrator: Migrator = async () => {
  const zones = await MZoneModel.find({}).exec()

  console.log(`[Migrator] [Zone] Migrating ${zones.length} records`)
  const BAR = createPBar('Zone', zones.length)

  for (const zone of zones) {
    const i = zone.toJSON() as any
    const postgresDoc = {
      arkZoneId: i.zoneId,
      index: i.zoneIndex,
      category: i.type,
      type: i.subType,
      name: i.zoneNameMap,
      existence: i.existence,
      background: i.background,
    }
    await PZone.create(postgresDoc)
    BAR.tick()
  }

  console.log(`[Migrator] [Zone] Finished migrating ${zones.length} records`)
}

export default zoneMigrator
