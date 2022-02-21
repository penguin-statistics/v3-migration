import { Migrator } from './index'
import { MItemDropModel } from '../models/mongo/item_drop_v2'
import { PDropPattern } from '../models/postgresql/drop_pattern'
import { PDropPatternElement } from '../models/postgresql/drop_pattern_element'
import { PDropReport } from '../models/postgresql/drop_report'
import { cache, redisCache } from '../utils/cache'
import { PAccount } from '../models/postgresql/account'
import { createPBar } from '../utils/pbar'
import { PDropReportExtras } from '../models/postgresql/drop_report_extras'
import { XXHash3 } from 'xxhash-addon'

const hasher = new XXHash3(0)

interface Drop {
  quantity: number
  itemId: number
}

const PAGE_SIZE = 5000

const HASH_CACHE = new Map()

export const dropsToHash = (drops: Drop[]) => {
  const mapped = drops.map((drop) => `${drop.itemId}:${drop.quantity}`)
  mapped.sort()
  const str = mapped.join('|')
  const got = HASH_CACHE.get(str)
  if (got) {
    return [got, str]
  }
  hasher.update(Buffer.from(str, 'utf-8'))
  const hash = hasher.digest().toString('hex')
  HASH_CACHE.set(str, hash)
  hasher.reset()
  return [hash, str]
}

const dropReportMigrator: Migrator = async () => {
  // create a map of account id and penguin id
  const accounts = (await PAccount.findAll({})) as any
  const accountsMap = {}
  accounts.forEach(
    (account) => (accountsMap[account.penguinId] = account.accountId),
  )

  const dbQueues = []

  const allCount = await MItemDropModel.count()
  const BAR = createPBar('DropReport', allCount)
  let currentIndex = 0
  const cursor = MItemDropModel.find({}).cursor({ batchSize: PAGE_SIZE })
  let dropReportBulk = []
  let dropReportExtraBulk = []
  for (
    let item = await cursor.next();
    item != null;
    item = await cursor.next()
  ) {
    const i = item.toObject() as any
    const stage = cache.get(`stage:stageId_${i.stageId}`) as any
    if (!stage || !i.server || !i.userID) {
      continue
    }

    const accountId = accountsMap[i.userID]
    if (!accountId) {
      continue
    }

    const drops = i.drops
      .map((el) => {
        const itemFromCache = cache.get(`item:itemId_${el.itemId}`) as any
        if (!itemFromCache) return null
        return {
          itemId: itemFromCache.itemId,
          quantity: el.quantity,
        }
      })
      .filter((el) => el !== null && el.quantity > 0)

    // group by item id and sum quantity
    const groupedDrops = drops.reduce((acc, cur) => {
      const itemId = cur.itemId
      const quantity = cur.quantity
      if (!acc[itemId]) {
        acc[itemId] = {
          itemId,
          quantity,
        }
      } else {
        acc[itemId].quantity += quantity
      }
      return acc
    }, {})

    const [hash, hashOriginal] = dropsToHash(Object.values(groupedDrops))

    const pattern = (await redisCache.get(`pattern:hash_${hash}`)) as any

    let patternId: number

    if (pattern) {
      patternId = pattern.patternId
    } else {
      const newPattern = (await PDropPattern.create({
        hash,
        originalFingerprint: hashOriginal,
      })) as any

      patternId = newPattern.patternId

      await redisCache.set(`pattern:hash_${hash}`, newPattern.toJSON())

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

      await PDropPatternElement.bulkCreate(drops, { returning: false })
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
      metadata: i.screenshotMetadata ? metadata : null,
      md5: i.screenshotMetadata ? md5 : null,
    })

    if (dropReportBulk.length % PAGE_SIZE === 0 || currentIndex >= allCount) {
      dbQueues.push(
        Promise.all([
          PDropReport.bulkCreate(dropReportBulk, { returning: false }),
          PDropReportExtras.bulkCreate(dropReportExtraBulk, {
            returning: false,
          }),
        ]).then(() => {
          // discard results: we dont need that
          return Promise.resolve()
        }),
      )

      BAR.tick(dropReportBulk.length)

      dropReportBulk = []
      dropReportExtraBulk = []
    }
  }
  await Promise.all(dbQueues)
  console.log('\n')
}

export default dropReportMigrator
