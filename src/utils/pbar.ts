const ProgressBar = require('progress')

export function createPBar(type: string, length: number) {
  return new ProgressBar(
    `[Migrator] [${type}] Migrating... [:bar] :rate/rps ETA :percent :etas`,
    {
      total: length,
      width: 100,
    },
  )
}
