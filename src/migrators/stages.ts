import { Migrator } from "./index"
import { MStageModel } from "../models/mongo/stage_v2"
import { PStage } from "../models/postgresql/stage"
import { PZone } from "../models/postgresql/zone"
import { cache } from "../utils/cache"

const normalizeSanity = (sanity: number): number | null => {
  if (sanity === 99) return null
  return sanity
}

const stageMigrator: Migrator = async () => {
  const stages = await MStageModel.find({}).exec()

  console.log(`[Migrator] [Stage] Migrating ${stages.length} records`)

  for (const stage of stages) {
    const i = stage.toJSON() as any

    const zone = await PZone.findOne({
      where: {
        zoneId: i.zoneId
      }
    }) as any

    const postgresDoc = {
      stageId: i.stageId,
      zoneId: zone.id,
      code: i.codeMap,
      sanity: normalizeSanity(i.apCost),
      existence: i.existence,
      minClearTime: i.minClearTime
    }
    const created = await PStage.create(postgresDoc)

    cache.set(`stage:stageId_${i.stageId}`, created.toJSON())
  }

  console.log(`[Migrator] [Stage] Finished migrating ${stages.length} records`)
}

export default stageMigrator
