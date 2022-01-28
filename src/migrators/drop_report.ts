import { Migrator } from './index'
import { MItemDropModel } from '../models/mongo/item_drop_v2'
import crypto from 'crypto'
import { PDropPattern } from '../models/postgresql/drop_pattern'
import { PDropPatternElement } from '../models/postgresql/drop_pattern_element'
import { PDropReport } from '../models/postgresql/drop_report'
import { cache } from '../utils/cache'
import { PAccount } from '../models/postgresql/account'
import { createPBar } from '../utils/pbar'

const sha256 = (str: string): string => {
  const h = crypto.createHash('sha256')
  h.update(str)
  return h.digest('hex')
}
interface Drop {
  quantity: number
  itemId: string
}

const pageSize = 10000
const totalLimit = 10000000

const dropsToHash = (drops: Drop[]) => {
  const mapped = drops.map((drop) => `${drop.itemId}:${drop.quantity}`)
  mapped.sort()
  return sha256(mapped.join('|'))
}

const dropReportMigrator: Migrator = async () => {
  // create a map of account id and penguin id
  const accounts = (await PAccount.findAll({})) as any
  const accountsMap = {}
  accounts.forEach(
    (account) => (accountsMap[account.penguinId] = account.accountId),
  )

  const allCount = await MItemDropModel.count()
  const shouldImportCount = Math.min(totalLimit, allCount)
  const BAR = createPBar('DropReport', shouldImportCount)
  let finishedNum = 0
  while (finishedNum < totalLimit) {
    const itemDrops = await MItemDropModel.find({})
      .skip(finishedNum)
      .limit(Math.min(pageSize, shouldImportCount - finishedNum))
      .exec()
    if (itemDrops.length === 0) {
      break
    }
    // console.log(`[Migrator] [DropReport] Migrating ${finishedNum}/${shouldImportCount} records`)

    let oneBulk = []
    for (const item of itemDrops) {
      const i = item.toJSON() as any

      // console.log(`  - [Migrator] [DropReport] Migrating ${i._id}`)

      const stage = cache.get(`stage:stageId_${i.stageId}`) as any
      if (!stage || !i.server || !i.isReliable || !i.userID) {
        continue
      }

      const accountId = accountsMap[i.userID]
      if (!accountId) {
        continue
      }

      const hash = dropsToHash(i.drops)

      const pattern = cache.get(`pattern:hash_${hash}`) as any
      // console.log('> pattern cache with key', `pattern:hash_${hash}`, 'returned', pattern)

      let patternId: number

      if (pattern) {
        patternId = pattern.patternId
      } else {
        const newPattern = (await PDropPattern.create({ hash })) as any

        patternId = newPattern.patternId

        cache.set(`pattern:hash_${hash}`, newPattern.toJSON())

        const drops = i.drops
          .filter((drop: Drop) => drop.itemId && drop.quantity > 0)
          .map((drop: Drop) => {
            const item = cache.get(`item:itemId_${drop.itemId}`) as any
            if (!item) {
              return null
            }
            return {
              itemId: item.itemId,
              quantity: drop.quantity,
              dropPatternId: patternId,
            }
          })
          .filter((drop: Drop) => drop !== null)

        await PDropPatternElement.bulkCreate(drops)
      }

      const ips = i.ip.split(',').map((el) => el.trim())

      // if (ips.length > 1) {
      //   console.log('  - Multiple IP:', ips)
      // }
      oneBulk.push({
        stageId: stage.stageId,
        patternId,
        times: i.times,
        ip: ips[0],
        createdAt: i.timestamp,
        deleted: i.isDeleted,
        reliable: i.isReliable,
        server: i.server,
        accountId: accountId,
        sourceName: i.source,
        version: i.version,
      })
    }
    await PDropReport.bulkCreate(oneBulk)
    finishedNum += itemDrops.length
    // console.log(`[Migrator] [DropReport] Migrated ${oneBulk.length}/${itemDrops.length} records in this page.`)
    BAR.tick(itemDrops.length)
  }
}

export default dropReportMigrator
