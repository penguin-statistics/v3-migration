import { Migrator } from "."
import { MItemDropModel } from "../models/mongo/item_drop_v2"
import crypto from 'crypto'
import { PDropPattern } from "../models/postgresql/drop_pattern"
import { PDropPatternElement } from "../models/postgresql/drop_pattern_element"
import { PDropReport } from "../models/postgresql/drop_report"
import { cache } from "../utils/cache"

const sha256 = (str: string): string => {
  const h = crypto.createHash('sha256')
  h.update(str)
  return h.digest('hex')
}

interface Drop {
  quantity: number
  itemId: string
}

const dropsToHash = (drops: Drop[]) => {
  const mapped = drops.map(drop => (`${drop.itemId}:${drop.quantity}`))
  mapped.sort()
  return sha256(mapped.join("|"))
}

const dropReportMigrator: Migrator = async () => {
  const itemDrops = await MItemDropModel.find({}).limit(100000).exec()

  console.log(`[Migrator] [DropReport] Migrating ${itemDrops.length} records`)

  for (const item of itemDrops) {
    const i = item.toJSON() as any

    // console.log(`  - [Migrator] [DropReport] Migrating ${i._id}`)

    const hash = dropsToHash(i.drops)

    const pattern = cache.get(`pattern:hash_${hash}`) as any
    // console.log('> pattern cache with key', `pattern:hash_${hash}`, 'returned', pattern)

    let patternId: number

    if (pattern) {
      patternId = pattern.id
    } else {
      const newPattern = await PDropPattern.create({ hash }) as any

      patternId = newPattern.id

      cache.set(`pattern:hash_${hash}`, newPattern.toJSON())

      const drops = i.drops.map((drop: Drop) => ({
        itemId: (cache.get(`item:itemId_${drop.itemId}`) as any).id,
        quantity: drop.quantity,
        dropPatternId: patternId,
      }))

      await PDropPatternElement.bulkCreate(drops)
    }

    const stage = (cache.get(`stage:stageId_${i.stageId}`)) as any

    const ips = i.ip.split(',').map(el => el.trim())

    if (ips.length > 1) {
      console.log('  - Multiple IP:', ips)
    }

    const created = await PDropReport.create({
      stageId: stage.id,
      patternId,
      times: i.times,
      ip: ips[0],
      createdAt: i.timestamp,
      reliable: i.isReliable,
      deleted: i.isDeleted,
      server: i.server
    })

    // console.log('> setting pattern cache with key', `pattern:hash_${hash}`, 'to', created.toJSON())

  }
}

export default dropReportMigrator
