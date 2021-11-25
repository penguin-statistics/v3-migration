import { Migrator } from "./index"
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

const pageSize = 10000;
const totalLimit = 10000000;

const dropsToHash = (drops: Drop[]) => {
  const mapped = drops.map(drop => (`${drop.itemId}:${drop.quantity}`))
  mapped.sort()
  return sha256(mapped.join("|"))
}

const dropReportMigrator: Migrator = async () => {
  const allCount = await MItemDropModel.count();
  const shouldImportCount = Math.min(totalLimit, allCount);
  let finishedNum = 0;
  while (finishedNum < totalLimit) {
    const itemDrops = await MItemDropModel.find({}).skip(finishedNum).limit(Math.min(pageSize, shouldImportCount - finishedNum)).exec()
    if (itemDrops.length === 0) {
      break;
    }
    console.log(`[Migrator] [DropReport] Migrating ${finishedNum}/${shouldImportCount} records`)

    let oneBulk = [];
    for (const item of itemDrops) {
      const i = item.toJSON() as any

      // console.log(`  - [Migrator] [DropReport] Migrating ${i._id}`)

      const stage = (cache.get(`stage:stageId_${i.stageId}`)) as any
      if (!stage || !i.server || !i.isReliable) {
        continue;
      }

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

        const drops = i.drops.filter((drop: Drop) => drop.itemId && drop.quantity > 0).map((drop: Drop) => {
          const item = cache.get(`item:itemId_${drop.itemId}`) as any;
          if (!item) {
            return null;
          }
          return {
            itemId: item.id,
            quantity: drop.quantity,
            dropPatternId: patternId,
          };
        }).filter((drop: Drop) => drop !== null);

        await PDropPatternElement.bulkCreate(drops)
      }

      const ips = i.ip.split(',').map(el => el.trim())

      // if (ips.length > 1) {
      //   console.log('  - Multiple IP:', ips)
      // }

      oneBulk.push({
        stageId: stage.id,
        patternId,
        times: i.times,
        ip: ips[0],
        createdAt: i.timestamp,
        deleted: i.isDeleted,
        server: i.server
      });
    }
    await PDropReport.bulkCreate(oneBulk);
    finishedNum += itemDrops.length;
    console.log(`[Migrator] [DropReport] Migrated ${oneBulk.length}/${itemDrops.length} records in this page.`)
  }
}

export default dropReportMigrator
