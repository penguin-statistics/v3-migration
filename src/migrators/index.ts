import itemMigrator from './items'
import zonesMigrator from './zones'
import stagesMigrator from './stages'
import dropReportMigrator from './drop_report'
import activityMigrator from './activities'
import noticeMigrator from './notices'
import propertyMigrator from './properties'
import timeRangeMigrator from './time_ranges'
import dropInfoMigrator from './drop_info'
import accountMigrator from './accounts'
import finalizeMigrator from './finalize'

export type Migrator = () => Promise<void>

const migrators: Migrator[] = [
  noticeMigrator,
  propertyMigrator,
  timeRangeMigrator,
  activityMigrator,
  accountMigrator,
  itemMigrator,
  zonesMigrator,
  stagesMigrator,
  dropInfoMigrator,
  dropReportMigrator,
  finalizeMigrator,
]

export const migrate = async () => {
  for (const migrator of migrators) {
    await migrator()
  }
}
