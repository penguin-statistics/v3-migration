import { Migrator } from './index'
import { MItemModel } from '../models/mongo/item'
import { PItem } from '../models/postgresql/item'
import { cache } from '../utils/cache'
import { createPBar } from '../utils/pbar'

const itemMigrator: Migrator = async () => {
  const items = await MItemModel.find({}).exec()

  console.log(`[Migrator] [Item] Migrating ${items.length} records`)
  const BAR = createPBar('Item', items.length)

  for (const item of items) {
    const i = item.toJSON() as any
    const postgresDoc = {
      arkItemId: i.itemId,
      existence: i.existence,
      name: i.nameMap,
      sortId: i.sortId,
      rarity: i.rarity,
      type: i.itemType,
      group: i.groupID,
      sprite: i.spriteCoord ? i.spriteCoord.join(':') : null,
      keywords: {
        alias: i.aliasMap,
        pron: i.pronMap,
      },
    }
    const created = await PItem.create(postgresDoc)

    cache.set(`item:itemId_${i.itemId}`, created.toJSON())

    BAR.tick()
  }

  console.log(`[Migrator] [Item] Finished migrating ${items.length} records`)
}

export default itemMigrator
