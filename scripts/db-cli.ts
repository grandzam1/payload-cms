import { spawnSync } from 'node:child_process'
import pg from 'pg'
import {
  applyDatabaseEnv,
  formatDatabaseStatus,
  maskDatabaseUrl,
  setDbTargetInEnvFile,
  type DbTarget,
} from '../src/lib/database-env'
import {
  copyLatestToSeed,
  exportDatabase,
  formatSnapshotStatus,
  importDatabase,
  LATEST_DUMP,
  printExportSummary,
  printImportSummary,
  SEED_DUMP,
  syncBetweenTargets,
} from '../src/lib/database-data'

const { Pool } = pg

const command = process.argv[2]

async function testConnection() {
  const config = applyDatabaseEnv()
  const pool = new Pool({
    connectionString: config.databaseUrlUnpooled || config.databaseUrl,
    max: 1,
    connectionTimeoutMillis: 10000,
    ssl: config.isLocal ? false : { rejectUnauthorized: false },
  })

  try {
    const result = await pool.query('select current_database() as db, version() as version')
    const row = result.rows[0]
    console.log('OK', {
      target: config.target,
      database: row.db,
      host: new URL(config.databaseUrl).host,
      version: String(row.version).split(' ').slice(0, 2).join(' '),
    })
  } finally {
    await pool.end()
  }
}

function pullNeonEnv() {
  const vercel = process.platform === 'win32' ? 'vercel.cmd' : 'vercel'
  const result = spawnSync(vercel, ['env', 'pull', '.env.neon', '--yes'], {
    stdio: 'inherit',
    shell: true,
  })
  process.exit(result.status ?? 1)
}

async function switchTarget(target: DbTarget, withData: boolean) {
  const current = (process.env.DB_TARGET || 'local') as DbTarget

  if (withData && current !== target) {
    try {
      const currentConfig = applyDatabaseEnv()
      const exported = await exportDatabase(currentConfig, LATEST_DUMP)
      printExportSummary(currentConfig, exported.dest, exported.counts)
    } catch (error) {
      console.warn(
        `[db] export skipped: ${error instanceof Error ? error.message : error}`,
      )
    }
  }

  setDbTargetInEnvFile(target)
  process.env.DB_TARGET = target
  const config = applyDatabaseEnv()

  console.log(`Switched to ${target}`)
  console.log(`host=${new URL(config.databaseUrl).host}`)
  console.log(`url=${maskDatabaseUrl(config.databaseUrl)}`)

  if (withData) {
    const src = LATEST_DUMP
    try {
      const imported = await importDatabase(config, src)
      printImportSummary(config, imported.src, imported.counts)
    } catch (error) {
      console.warn(
        `[db] import skipped: ${error instanceof Error ? error.message : error}`,
      )
      console.warn('[db] Run: pnpm db:pull  (copy Neon data into local)')
    }
  }
}

function printHelp() {
  console.log(`Database CLI — local Windows Postgres vs Neon

Targets:
  status              Show active DB target and resolved URL
  use local           Switch .env to local Postgres
  use neon            Switch .env to Neon
  switch local        Export current → switch local → import snapshot
  switch neon         Export current → switch neon → import snapshot
  test                Test connection to the active database
  pull-neon           Pull Neon/Vercel env into .env.neon

Data snapshots (saved in data/db/latest.sql):
  export              Export active DB → data/db/latest.sql
  import              Import data/db/latest.sql → active DB
  pull                Neon → export → import → local (full content sync)
  push                Local → export → import → Neon
  seed                Copy latest snapshot → data/seed/dev.sql (commit-friendly)
  seed:import         Import data/seed/dev.sql → active DB
  snapshot            Show saved snapshot info

Examples:
  pnpm db:status
  pnpm db:pull                 # copy Neon content to local
  pnpm db:switch:local           # switch + keep data in sync
  pnpm db:export && pnpm db:seed # save baseline in repo
  pnpm db:seed:import            # bootstrap a fresh DB from seed
`)
}

async function main() {
  switch (command) {
    case 'status':
      console.log(formatDatabaseStatus())
      console.log('---')
      console.log(formatSnapshotStatus())
      break
    case 'use': {
      const target = process.argv[3] as DbTarget
      if (target !== 'local' && target !== 'neon') {
        console.error('Usage: pnpm db:use:local | pnpm db:use:neon')
        process.exit(1)
      }
      await switchTarget(target, false)
      break
    }
    case 'switch': {
      const target = process.argv[3] as DbTarget
      if (target !== 'local' && target !== 'neon') {
        console.error('Usage: pnpm db:switch:local | pnpm db:switch:neon')
        process.exit(1)
      }
      await switchTarget(target, true)
      break
    }
    case 'export': {
      const config = applyDatabaseEnv()
      const seed = process.argv.includes('--seed')
      const exported = await exportDatabase(config, LATEST_DUMP)
      printExportSummary(config, exported.dest, exported.counts)
      if (seed) {
        await copyLatestToSeed()
        console.log(`Saved seed: ${SEED_DUMP}`)
      }
      break
    }
    case 'import': {
      const config = applyDatabaseEnv()
      const imported = await importDatabase(config, LATEST_DUMP)
      printImportSummary(config, imported.src, imported.counts)
      break
    }
    case 'pull':
      await syncBetweenTargets('neon', 'local')
      setDbTargetInEnvFile('local')
      break
    case 'push':
      await syncBetweenTargets('local', 'neon')
      setDbTargetInEnvFile('neon')
      break
    case 'seed':
      await copyLatestToSeed()
      console.log(`Saved seed: ${SEED_DUMP}`)
      break
    case 'seed:import': {
      const config = applyDatabaseEnv()
      const imported = await importDatabase(config, SEED_DUMP)
      printImportSummary(config, imported.src, imported.counts)
      break
    }
    case 'snapshot':
      console.log(formatSnapshotStatus())
      break
    case 'test':
      await testConnection()
      break
    case 'pull-neon':
      pullNeonEnv()
      break
    default:
      printHelp()
      process.exit(command ? 1 : 0)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
