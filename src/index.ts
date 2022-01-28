import { mongoose } from "@typegoose/typegoose";
import { migrate } from "./migrators";
import { PActivity } from "./models/postgresql/activity";
import { PDropInfo } from "./models/postgresql/drop_info";
import { PDropPattern } from "./models/postgresql/drop_pattern";
import { PDropPatternElement } from "./models/postgresql/drop_pattern_element";
import { PDropReport } from "./models/postgresql/drop_report";
import { PItem } from "./models/postgresql/item";
import { PNotice } from "./models/postgresql/notice";
import { PProperty } from "./models/postgresql/property";
import { PStage } from "./models/postgresql/stage";
import { PTimeRange } from "./models/postgresql/time_range";
import { PAccount } from "./models/postgresql/account";
import { PZone } from "./models/postgresql/zone";
import sequelize from "./utils/postgresql";
import { PDropMatrixElement } from './models/postgresql/drop_matrix_element';

async function init() {
  console.log("[Migrator] Initializing...");

  console.log("[Migrator] Connecting to MongoDB...");
  await mongoose.connect("mongodb://localhost:27017/penguin_stats")
  await mongoose.connection.db.admin().ping();
  console.log("[Migrator] MongoDB Connected.");
  console.log("[Migrator] Connecting to PostgreSQL...");
  await sequelize.authenticate();
  console.log("[Migrator] PostgreSQL Connected.");

  await PItem.sync({ force: true });
  await PZone.sync({ force: true });
  await PStage.sync({ force: true });
  await PAccount.sync({ force: true });
  await PActivity.sync({ force: true });
  await PDropPattern.sync({ force: true });
  await PDropReport.sync({ force: true });
  await PDropPatternElement.sync({ force: true });
  await PDropMatrixElement.sync({ force: true });
  await PNotice.sync({ force: true });
  await PProperty.sync({ force: true });
  await PTimeRange.sync({ force: true });
  await PDropInfo.sync({ force: true });

  await migrate();

  process.exit(0)
}

init()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  })

