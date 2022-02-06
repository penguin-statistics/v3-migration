import { Migrator } from './index'
import { MItemDropModel } from '../models/mongo/item_drop_v2'
import crypto from 'crypto'
import { PDropPattern } from '../models/postgresql/drop_pattern'
import { PDropPatternElement } from '../models/postgresql/drop_pattern_element'
import { PDropReport } from '../models/postgresql/drop_report'
import { cache } from '../utils/cache'
import { PAccount } from '../models/postgresql/account'
import { createPBar } from '../utils/pbar'
import { PDropReportExtras } from '../models/postgresql/drop_report_extras'
import xxhashjs from 'xxhashjs'

interface Drop {
  quantity: number
  itemId: number
}

const pageSize = 10000
const totalLimit = 10000000

const dropsToHash = (drops: Drop[]) => {
  const mapped = drops.map((drop) => `${drop.itemId}:${drop.quantity}`)
  mapped.sort()
  return xxhashjs.h64(mapped.join('|'), 0).toString(16)
}

const dropReportMigrator: Migrator = async () => {
  // create a map of account id and penguin id
  const accounts = (await PAccount.findAll({})) as any
  const accountsMap = {}
  accounts.forEach(
    (account) => (accountsMap[account.penguinId] = account.accountId),
  )
  // maximum 2 concurrency
  let lastOperationPromise: Promise<any> | undefined

  const allCount = await MItemDropModel.count()
  const shouldImportCount = Math.min(totalLimit, allCount)
  const BAR = createPBar('DropReport', shouldImportCount)
  let finishedNum = 0
  let currentIndex = 0
  while (finishedNum < totalLimit) {
    const itemDrops = await MItemDropModel.find({})
      .skip(finishedNum)
      .limit(Math.min(pageSize, shouldImportCount - finishedNum))
      .exec()
    if (itemDrops.length === 0) {
      break
    }
    // console.log(`[Migrator] [DropReport] Migrating ${finishedNum}/${shouldImportCount} records`)

    for (const item of itemDrops) {
      let dropReportBulk = []
      let dropReportExtraBulk = []

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

      const hash = dropsToHash(
        i.drops
          .map((el) => {
            const item = cache.get(`item:itemId_${el.itemId}`) as any
            if (!item) return null
            return {
              itemId: item.itemId,
              quantity: el.quantity,
            }
          })
          .filter((el) => el !== null),
      )

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

      const reliability = (() => {
        if (i.isDeleted) return -1
        if (i.isReliable && !i.isDeleted) return 0
        if (!i.isReliable && !i.isDeleted) return 1

        throw new Error('this fucking world is collapsing :(')
      })()

      currentIndex += 1

      dropReportBulk.push({
        reportId: currentIndex,
        stageId: stage.stageId,
        patternId,
        times: i.times,
        createdAt: i.timestamp,
        reliability: reliability,
        server: i.server,
        accountId: accountId,
      })

      const { md5, ...metadata } = i.screenshotMetadata || {}

      dropReportExtraBulk.push({
        reportId: currentIndex,
        sourceName: i.source,
        version: i.version,
        ip: ips[0],
        metadata: metadata || null,
        md5,
      })
      if (lastOperationPromise) await lastOperationPromise
      ;(async () => {
        lastOperationPromise = Promise.all([
          await PDropReport.bulkCreate(dropReportBulk),
          await PDropReportExtras.bulkCreate(dropReportExtraBulk),
        ])
      })()
    }
    finishedNum += itemDrops.length
    // console.log(`[Migrator] [DropReport] Migrated ${oneBulk.length}/${itemDrops.length} records in this page.`)
    BAR.tick(itemDrops.length)
  }
  if (lastOperationPromise) await lastOperationPromise
}

export default dropReportMigrator
