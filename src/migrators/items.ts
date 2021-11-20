import { Migrator } from "."
import { MItemModel } from "../models/mongo/item"
import { PItem } from "../models/postgresql/item"
import { cache } from "../utils/cache"

const itemMigrator: Migrator = async () => {
  const items = await MItemModel.find({}).exec()

  console.log(`[Migrator] [Item] Migrating ${items.length} records`)

  for (const item of items) {
    const i = item.toJSON() as any
    const postgresDoc = {
      itemId: i.itemId,
      existence: i.existence,
      name: i.nameMap,
      sortId: i.sortId,
      rarity: i.rarity,
      group: i.groupID,
      sprite: i.spriteCoord ? i.spriteCoord.join(':') : null,
      keywords: {
        alias: i.aliasMap,
        pron: i.pronMap
      }
    }
    const created = await PItem.create(postgresDoc)

    cache.set(`item:itemId_${i.itemId}`, created.toJSON())
  }
}

export default itemMigrator
