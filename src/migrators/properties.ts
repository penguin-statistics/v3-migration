import { Migrator } from '.'
import { MPropertiesModel } from '../models/mongo/properties'
import { PProperty } from '../models/postgresql/property'

const propertyMigrator: Migrator = async () => {
  const properties = await MPropertiesModel.find({}).exec()

  console.log(`[Migrator] [Properties] Migrating ${properties.length} records`)

  for (const property of properties) {
    const i = property.toJSON() as any
    const postgresDoc = {
      key: i.key,
      value: i.value,
    }
    await PProperty.create(postgresDoc)
  }
}

export default propertyMigrator
