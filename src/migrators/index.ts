import itemMigrator from './items'
import zonesMigrator from './zones'
import stagesMigrator from './stages'
import dropReportMigrator from './drop_report'
import activityMigrator from './activities'
import noticeMigrator from './notices'
import propertyMigrator from './properties'

export type Migrator = () => Promise<void>

const migrators: Migrator[] = [
  itemMigrator,
  zonesMigrator,
  stagesMigrator,
  dropReportMigrator,
  activityMigrator,
  noticeMigrator,
  propertyMigrator,
]

export const migrate = async () => {
  for (const migrator of migrators) {
    await migrator()
  }
}
