import itemMigrator from './items'
import zonesMigrator from './zones'
import stagesMigrator from './stages'
import dropReportMigrator from './drop_report'

export type Migrator = () => Promise<void>

const migrators: Migrator[] = [
  itemMigrator,
  zonesMigrator,
  stagesMigrator,
  dropReportMigrator
]

export const migrate = async () => {
  for (const migrator of migrators) {
    await migrator()
  }
}
