import sequelize from '../utils/postgresql'
import { Migrator } from './index'
const finalizeMigrator: Migrator = async () => {
  const max = (
    (
      await sequelize.query('SELECT MAX(report_id) FROM drop_reports')
    )[0][0] as any
  ).max
  await sequelize.query(
    `CREATE SEQUENCE drop_reports_report_id_seq MINVALUE ${max}`,
  )
  await sequelize.query(
    "ALTER TABLE drop_reports ALTER report_id SET DEFAULT nextval('drop_reports_report_id_seq')",
  )
  await sequelize.query(
    `ALTER SEQUENCE drop_reports_report_id_seq OWNED BY drop_reports.report_id`,
  )
}

export default finalizeMigrator
