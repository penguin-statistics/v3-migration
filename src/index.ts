import { mongoose } from "@typegoose/typegoose";
import { migrate } from "./migrators";
import { PActivity } from "./models/postgresql/activity";
import { PDropPattern } from "./models/postgresql/drop_pattern";
import { PDropPatternElement } from "./models/postgresql/drop_pattern_element";
import { PDropReport } from "./models/postgresql/drop_report";
import { PItem } from "./models/postgresql/item";
import { PNotice } from "./models/postgresql/notice";
import { PProperty } from "./models/postgresql/property";
import { PStage } from "./models/postgresql/stage";
import { PZone } from "./models/postgresql/zone";
import sequelize from "./utils/postgresql";

async function init() {
  await mongoose.connect("mongodb://localhost:27017/penguin_stats")
  await mongoose.connection.db.admin().ping();

  await sequelize.authenticate();

  await PItem.sync({ force: true });
  await PZone.sync({ force: true });
  await PStage.sync({ force: true });
  await PActivity.sync({ force: true });
  await PDropPattern.sync({ force: true });
  await PDropReport.sync({ force: true });
  await PDropPatternElement.sync({ force: true });
  await PNotice.sync({ force: true });
  await PProperty.sync({ force: true });

  await migrate();
}

init()
  .then(() => {
    console.log('Done')
  })
  .catch(err => {
    console.error(err)
  })
  .finally(() => {
    process.exit(0);
  })
