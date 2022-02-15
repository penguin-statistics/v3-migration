import { Migrator } from '.'
import { MEventPeriodModel } from '../models/mongo/event_period'
import { PActivity } from '../models/postgresql/activity'

const activityMigrator: Migrator = async () => {
  const eventPeriods = await MEventPeriodModel.find({}).exec()

  console.log(`[Migrator] [Activity] Migrating ${eventPeriods.length} records`)

  for (const eventPeriod of eventPeriods) {
    const i = eventPeriod.toJSON() as any
    const postgresDoc = {
      startTime: i.start,
      endTime: i.end ?? 62141368179000,
      name: i.labelMap,
      existence: i.existence,
    }
    await PActivity.create(postgresDoc)
  }
}

export default activityMigrator
