import itemMigrator from './items'
import zonesMigrator from './zones'
import stagesMigrator from './stages'
import dropReportMigrator from './drop_report'
import activityMigrator from './activities'
import noticeMigrator from './notices'
import propertyMigrator from './properties'
import timeRangeMigrator from './time_ranges'
import dropInfoMigrator from './drop_info'

export type Migrator = () => Promise<void>

const migrators: Migrator[] = [
  itemMigrator,
  zonesMigrator,
  stagesMigrator,
  noticeMigrator,
  propertyMigrator,
  dropReportMigrator,
  timeRangeMigrator,
  activityMigrator,
  dropInfoMigrator,
]

export const migrate = async () => {
  for (const migrator of migrators) {
    await migrator()
  }
}
