import { Migrator } from '.'
import { MDropInfoModel } from '../models/mongo/drop_info'
import { PDropInfo } from '../models/postgresql/drop_info'
import { cache } from '../utils/cache'
import { removeServerFromTimeRangeName } from '../utils/time_range'
import { createPBar } from '../utils/pbar'

const dropTypeMapping = {
  NORMAL_DROP: 'REGULAR',
  EXTRA_DROP: 'EXTRA',
  SPECIAL_DROP: 'SPECIAL',
}

const dropInfoMigrator: Migrator = async () => {
  const infos = await MDropInfoModel.find({}).exec()

  console.log(`[Migrator] [DropInfo] Migrating ${infos.length} records`)
  const BAR = createPBar('DropInfo', infos.length)

  const queue = []

  for (const info of infos) {
    const i = info.toObject() as any

    const stage = cache.get(`stage:stageId_${i.stageId}`) as any
    const item = i.itemId ? cache.get(`item:itemId_${i.itemId}`) : (null as any)

    const rangeName = removeServerFromTimeRangeName(i.timeRangeID)
    const timeRange = cache.get(
      `timeRange:timeRange_${rangeName}_${i.server}`,
    ) as any

    const dropType = dropTypeMapping[i.dropType]
      ? dropTypeMapping[i.dropType]
      : i.dropType

    const postgresDoc = {
      server: i.server,
      stageId: stage.stageId,
      itemId: item ? item.itemId : null,
      dropType: dropType,
      rangeId: timeRange.rangeId,
      bounds: i.bounds,
      accumulable: i.accumulatable != null ? i.accumulatable : false,
      extras:
        i.dropType === 'RECOGNITION_ONLY' ? { arkItemId: i.itemId } : null,
    }
    queue.push(postgresDoc)

    if (queue.length >= 1000) {
      await PDropInfo.bulkCreate(queue, { returning: false })
      queue.length = 0
    }
    BAR.tick()
  }
  await PDropInfo.bulkCreate(queue, { returning: false })
}

export default dropInfoMigrator
