import { Migrator } from '.'
import { MNoticeModel } from '../models/mongo/notice'
import { PNotice } from '../models/postgresql/notice'

const noticeMigrator: Migrator = async () => {
  const notices = await MNoticeModel.find({}).exec()

  console.log(`[Migrator] [Notice] Migrating ${notices.length} records`)

  for (const notice of notices) {
    const i = notice.toJSON() as any
    const postgresDoc = {
      conditions: i.conditions,
      severity: i.severity,
      content: i.contentMap,
    }
    await PNotice.create(postgresDoc)
  }
}

export default noticeMigrator
