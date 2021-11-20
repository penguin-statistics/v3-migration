import { Migrator } from "."
import { MZoneModel } from "../models/mongo/zone"
import { PZone } from "../models/postgresql/zone"

const zoneMigrator: Migrator = async () => {
  const zones = await MZoneModel.find({}).exec()

  console.log(`[Migrator] [Zone] Migrating ${zones.length} records`)

  for (const zone of zones) {
    const i = zone.toJSON() as any
    const postgresDoc = {
      zoneId: i.zoneId,
      index: i.zoneIndex,
      category: i.type,
      type: i.subType,
      name: i.zoneNameMap,
      existence: i.existence,
      background: i.background
    }
    await PZone.create(postgresDoc)
  }
}

export default zoneMigrator
