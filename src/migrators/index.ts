import itemMigrator from './items'
import zonesMigrator from './zones'
import stagesMigrator from './stages'
import dropReportMigrator from './drop_report'
import activityMigrator from './activities'
import noticeMigrator from './notices'

export type Migrator = () => Promise<void>

const migrators: Migrator[] = [
  itemMigrator,
  zonesMigrator,
  stagesMigrator,
  dropReportMigrator,
  activityMigrator,
  noticeMigrator,
]

export const migrate = async () => {
  for (const migrator of migrators) {
    await migrator()
  }
}
