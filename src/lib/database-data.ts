import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import {
  applyDatabaseEnv,
  maskDatabaseUrl,
  type DatabaseEnvConfig,
  type DbTarget,
} from './database-env'

const { Pool } = pg

export const DATA_DIR = path.join(process.cwd(), 'data', 'db')
export const SEED_DIR = path.join(process.cwd(), 'data', 'seed')
export const LATEST_DUMP = path.join(DATA_DIR, 'latest.sql')
export const SEED_DUMP = path.join(SEED_DIR, 'dev.sql')
export const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json')

export type DataManifest = {
  exportedAt: string
  source: DbTarget | 'vercel'
  host: string
  file: string
  counts: Record<string, number>
}

const CONTENT_TABLES = ['users', 'media', 'pages', 'posts', 'categories'] as const

function poolSsl(config: DatabaseEnvConfig) {
  return config.isLocal ? false : { rejectUnauthorized: false }
}

function connectionString(config: DatabaseEnvConfig) {
  return config.databaseUrlUnpooled || config.databaseUrl
}

/** pg_dump/psql reject some libpq params added for node-pg (e.g. uselibpqcompat). */
function cliConnectionString(config: DatabaseEnvConfig) {
  const url = new URL(connectionString(config))
  url.searchParams.delete('uselibpqcompat')
  url.searchParams.delete('channel_binding')
  return url.toString()
}

function pgToolEnv(config: DatabaseEnvConfig) {
  const url = new URL(cliConnectionString(config))
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    PGHOST: url.hostname,
    PGPORT: url.port || '5432',
    PGUSER: decodeURIComponent(url.username),
    PGDATABASE: url.pathname.replace(/^\//, ''),
  }

  if (url.password) {
    env.PGPASSWORD = decodeURIComponent(url.password)
  }

  if (config.isLocal) {
    env.PGSSLMODE = 'disable'
  } else {
    env.PGSSLMODE = url.searchParams.get('sslmode') || 'require'
  }

  return env
}

function runOrThrow(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
) {
  const result = spawnSync(command, args, {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(`${command} failed${detail ? `:\n${detail}` : ''}`)
  }

  return result.stdout
}

export async function countContentRows(config: DatabaseEnvConfig) {
  const pool = new Pool({
    connectionString: connectionString(config),
    max: 1,
    ssl: poolSsl(config),
  })

  const counts: Record<string, number> = {}

  try {
    for (const table of CONTENT_TABLES) {
      const exists = await pool.query(
        `select to_regclass($1) as reg`,
        [`public.${table}`],
      )
      if (!exists.rows[0]?.reg) {
        counts[table] = 0
        continue
      }
      const result = await pool.query(`select count(*)::int as c from "${table}"`)
      counts[table] = result.rows[0].c
    }
  } finally {
    await pool.end()
  }

  return counts
}

export function writeManifest(
  config: DatabaseEnvConfig,
  file: string,
  counts: Record<string, number>,
) {
  fs.mkdirSync(DATA_DIR, { recursive: true })

  const manifest: DataManifest = {
    exportedAt: new Date().toISOString(),
    source: config.target === 'vercel' ? 'neon' : config.target,
    host: safeHost(config.databaseUrl),
    file: path.relative(process.cwd(), file),
    counts,
  }

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  return manifest
}

function safeHost(url: string) {
  try {
    return new URL(url).host
  } catch {
    return 'unknown'
  }
}

export async function clearPublicData(config: DatabaseEnvConfig) {
  const pool = new Pool({
    connectionString: connectionString(config),
    max: 1,
    ssl: poolSsl(config),
  })

  try {
    await pool.query(`
      do $$
      declare r record;
      begin
        for r in (
          select tablename
          from pg_tables
          where schemaname = 'public'
        ) loop
          execute 'truncate table public.' || quote_ident(r.tablename) || ' cascade';
        end loop;
      end $$;
    `)
  } finally {
    await pool.end()
  }
}

function runPgTool(
  tool: string,
  config: DatabaseEnvConfig,
  args: string[],
  inputFile?: string,
) {
  const conn = cliConnectionString(config)
  const baseArgs = [...args]
  if (inputFile) {
    baseArgs.push('--file', inputFile)
  }
  baseArgs.push(conn)

  if (tool.endsWith('.exe')) {
    return runOrThrow(tool, baseArgs, { PATH: process.env.PATH })
  }

  const pgArgs = [...args]
  if (inputFile) {
    pgArgs.push('--file', inputFile)
  }
  pgArgs.push('--dbname', conn)

  return runOrThrow(tool, pgArgs, pgToolEnv(config))
}

export async function exportDatabase(
  config: DatabaseEnvConfig,
  dest = LATEST_DUMP,
) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })

  const tool = pgDumpBinary(config)
  console.log(
    `[db:export] target=${config.target} host=${safeHost(connectionString(config))} tool=${tool}`,
  )

  const sql = runPgTool(tool, config, [
    '--data-only',
    '--no-owner',
    '--no-privileges',
  ])

  fs.writeFileSync(dest, sql)
  const counts = await countContentRows(config)
  const manifest = writeManifest(config, dest, counts)

  return { dest, manifest, counts }
}

export async function importDatabase(
  config: DatabaseEnvConfig,
  src = LATEST_DUMP,
) {
  if (!fs.existsSync(src)) {
    throw new Error(
      `No snapshot at ${path.relative(process.cwd(), src)}. Run: pnpm db:export`,
    )
  }

  await clearPublicData(config)

  const tool = psqlBinary(config)
  console.log(
    `[db:import] target=${config.target} host=${safeHost(connectionString(config))} tool=${tool}`,
  )

  runPgTool(
    tool,
    config,
    ['--single-transaction', '--set', 'ON_ERROR_STOP=1'],
    src,
  )

  const counts = await countContentRows(config)
  return { src, counts }
}

export async function copyLatestToSeed() {
  if (!fs.existsSync(LATEST_DUMP)) {
    throw new Error('No latest snapshot. Run: pnpm db:export')
  }
  fs.mkdirSync(SEED_DIR, { recursive: true })
  fs.copyFileSync(LATEST_DUMP, SEED_DUMP)
  if (fs.existsSync(MANIFEST_PATH)) {
    fs.copyFileSync(MANIFEST_PATH, path.join(SEED_DIR, 'manifest.json'))
  }
  return SEED_DUMP
}

export function loadConfigForTarget(target: DbTarget, cwd = process.cwd()) {
  delete process.env.DATABASE_URL
  delete process.env.DATABASE_URL_UNPOOLED
  delete process.env.VERCEL
  process.env.DB_TARGET = target
  return applyDatabaseEnv(cwd)
}

const WIN_PG_BIN = '/mnt/c/Program Files/PostgreSQL/18/bin'

function preferWindowsPgTool(name: 'pg_dump' | 'psql') {
  const winTool = path.join(WIN_PG_BIN, `${name}.exe`)
  if (fs.existsSync(winTool)) return winTool
  return name
}

function pgDumpBinary(_config: DatabaseEnvConfig) {
  return preferWindowsPgTool('pg_dump')
}

function psqlBinary(config: DatabaseEnvConfig) {
  // psql client tolerates version skew; WSL psql avoids Windows UNC/path issues
  if (config.isLocal) return 'psql'
  return preferWindowsPgTool('psql')
}

export async function syncBetweenTargets(
  from: DbTarget,
  to: DbTarget,
  options: { seed?: boolean } = {},
) {
  const fromConfig = loadConfigForTarget(from)
  const exported = await exportDatabase(fromConfig, LATEST_DUMP)
  console.log(
    `[db:export] from=${from} host=${safeHost(fromConfig.databaseUrl)} counts=${JSON.stringify(exported.counts)}`,
  )

  if (options.seed) {
    await copyLatestToSeed()
    console.log(`[db:seed] saved ${path.relative(process.cwd(), SEED_DUMP)}`)
  }

  const toConfig = loadConfigForTarget(to)
  const imported = await importDatabase(toConfig, LATEST_DUMP)
  console.log(
    `[db:import] to=${to} host=${safeHost(toConfig.databaseUrl)} counts=${JSON.stringify(imported.counts)}`,
  )

  return { exported, imported }
}

export function formatSnapshotStatus() {
  const lines = [`snapshot=${path.relative(process.cwd(), LATEST_DUMP)}`]

  if (fs.existsSync(LATEST_DUMP)) {
    const stat = fs.statSync(LATEST_DUMP)
    lines.push(`size=${(stat.size / 1024).toFixed(1)}KB`)
  } else {
    lines.push('size=missing')
  }

  if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as DataManifest
    lines.push(`exportedAt=${manifest.exportedAt}`)
    lines.push(`source=${manifest.source}`)
    lines.push(`counts=${JSON.stringify(manifest.counts)}`)
  }

  if (fs.existsSync(SEED_DUMP)) {
    lines.push(`seed=${path.relative(process.cwd(), SEED_DUMP)}`)
  }

  return lines.join('\n')
}

export function printExportSummary(
  config: DatabaseEnvConfig,
  dest: string,
  counts: Record<string, number>,
) {
  console.log('Exported', {
    target: config.target,
    host: safeHost(config.databaseUrl),
    url: maskDatabaseUrl(connectionString(config)),
    file: path.relative(process.cwd(), dest),
    counts,
  })
}

export function printImportSummary(
  config: DatabaseEnvConfig,
  src: string,
  counts: Record<string, number>,
) {
  console.log('Imported', {
    target: config.target,
    host: safeHost(config.databaseUrl),
    url: maskDatabaseUrl(connectionString(config)),
    file: path.relative(process.cwd(), src),
    counts,
  })
}
