import { Migrator } from "."
import { MTimeRangeModel } from "../models/mongo/time_range"
import { PTimeRange } from "../models/postgresql/time_range"
import { removeServerFromTimeRangeName } from "../utils/time_range"

const timeRangeMigrator: Migrator = async () => {
  const ranges = await MTimeRangeModel.find({}).exec()

  console.log(`[Migrator] [TimeRange] Migrating ${ranges.length} records`)

  for (const range of ranges) {
    const i = range.toJSON() as any
    let server;
    if (i.rangeID.endsWith('_CN')) {
      server = 'CN';
    } else if (i.rangeID.endsWith('_US')) {
      server = 'US';
    } else if (i.rangeID.endsWith('_JP_KR')) {
      server = 'JP';
    }

    let comment = i.comment;
    if (server === 'JP') {
      comment = comment.substring('日韩'.length);
      comment = '日' + comment;
    }
    
    const postgresDoc = {
      name: removeServerFromTimeRangeName(i.rangeID),
      startTime: i.start,
      endTime: i.end,
      comment: comment,
      server: server,
    }
    await PTimeRange.create(postgresDoc);

    if (server === 'JP') {
      const docCopy = { ...postgresDoc };
      docCopy.server = 'KR';
      comment = comment.substring('日'.length);
      comment = '韩' + comment;
      docCopy.comment = comment;
      await PTimeRange.create(docCopy);
    }
  }
}

export default timeRangeMigrator
