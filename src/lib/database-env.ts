import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

export type DbTarget = 'local' | 'neon'

export type DatabaseEnvConfig = {
  target: DbTarget | 'vercel'
  databaseUrl: string
  databaseUrlUnpooled: string
  usePostgres: boolean
  isLocal: boolean
  isNeon: boolean
}

const DEFAULT_LOCAL_URL = 'postgresql://postgres@127.0.0.1:5432/payload'

let envLoaded = false

function loadEnvFiles(cwd: string) {
  if (envLoaded) return
  dotenv.config({ path: path.join(cwd, '.env') })
  dotenv.config({ path: path.join(cwd, '.env.local'), override: true })
  envLoaded = true
}

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {}

  const out: Record<string, string> = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('=')
    if (i < 0) continue
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

function isLocalHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === 'host.docker.internal' ||
    hostname.endsWith('.local')
  )
}

function isNeonHost(hostname: string): boolean {
  return hostname.endsWith('.neon.tech')
}

function isUsablePostgresUrl(url: string | undefined): url is string {
  return Boolean(url && url.startsWith('postgres') && !url.includes('SENSITIVE'))
}

/** Normalize Postgres URLs for node-postgres (local Windows host vs Neon). */
export function resolvePostgresUrl(url: string): string {
  if (!url.startsWith('postgres')) return url

  try {
    const u = new URL(url)

    if (isLocalHost(u.hostname)) {
      u.searchParams.delete('channel_binding')
      u.searchParams.delete('sslmode')
      u.searchParams.delete('uselibpqcompat')
      return u.toString()
    }

    u.searchParams.delete('channel_binding')

    if (isNeonHost(u.hostname) && u.hostname.includes('-pooler')) {
      u.hostname = u.hostname.replace('-pooler', '')
    }

    u.searchParams.set('sslmode', 'require')
    u.searchParams.set('uselibpqcompat', 'true')

    if (u.port === '6543' && !u.searchParams.has('pgbouncer')) {
      u.searchParams.set('pgbouncer', 'true')
    }

    return u.toString()
  } catch {
    return url
  }
}

export function maskDatabaseUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.password) u.password = '****'
    return u.toString()
  } catch {
    return url.replace(/:[^:@/]+@/, ':****@')
  }
}

function readNeonEnv(cwd: string) {
  return parseEnvFile(path.join(cwd, '.env.neon'))
}

function resolveNeonUrls(cwd: string) {
  const neonFile = readNeonEnv(cwd)

  const unpooled =
    process.env.NEON_DATABASE_URL_UNPOOLED || neonFile.DATABASE_URL_UNPOOLED

  const pooled =
    process.env.NEON_DATABASE_URL || neonFile.DATABASE_URL || unpooled

  if (!isUsablePostgresUrl(unpooled)) {
    throw new Error(
      [
        'Neon is not configured.',
        'Add NEON_DATABASE_URL_UNPOOLED to .env, or run:',
        '  pnpm db:pull-neon',
        'Then switch with:',
        '  pnpm db:use:neon',
      ].join('\n'),
    )
  }

  return {
    databaseUrl: resolvePostgresUrl(pooled || unpooled),
    databaseUrlUnpooled: resolvePostgresUrl(unpooled),
  }
}

function resolveLocalUrls() {
  const local = process.env.LOCAL_DATABASE_URL || DEFAULT_LOCAL_URL
  const databaseUrl = resolvePostgresUrl(local)
  return {
    databaseUrl,
    databaseUrlUnpooled: databaseUrl,
  }
}

function applyToProcessEnv(databaseUrl: string, databaseUrlUnpooled: string) {
  process.env.DATABASE_URL = databaseUrl
  process.env.DATABASE_URL_UNPOOLED = databaseUrlUnpooled
}

/**
 * Single source of truth for DATABASE_URL selection.
 *
 * - DB_TARGET=local  → LOCAL_DATABASE_URL (Windows Postgres via localhost:5432)
 * - DB_TARGET=neon   → NEON_* or .env.neon (remote Neon for dev/testing)
 * - VERCEL set       → use platform DATABASE_URL (production Neon)
 */
export function applyDatabaseEnv(cwd = process.cwd()): DatabaseEnvConfig {
  loadEnvFiles(cwd)

  if (process.env.VERCEL) {
    const raw =
      process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || ''
    const databaseUrl = resolvePostgresUrl(raw)
    const databaseUrlUnpooled = process.env.DATABASE_URL_UNPOOLED
      ? resolvePostgresUrl(process.env.DATABASE_URL_UNPOOLED)
      : databaseUrl

    applyToProcessEnv(databaseUrl, databaseUrlUnpooled)

    let isNeon = false
    try {
      isNeon = isNeonHost(new URL(databaseUrl).hostname)
    } catch {
      /* ignore */
    }

    return {
      target: 'vercel',
      databaseUrl,
      databaseUrlUnpooled,
      usePostgres: databaseUrl.startsWith('postgres'),
      isLocal: false,
      isNeon,
    }
  }

  const target = (process.env.DB_TARGET || 'local') as DbTarget

  if (target === 'neon') {
    delete process.env.VERCEL
    const { databaseUrl, databaseUrlUnpooled } = resolveNeonUrls(cwd)
    applyToProcessEnv(databaseUrl, databaseUrlUnpooled)

    return {
      target: 'neon',
      databaseUrl,
      databaseUrlUnpooled,
      usePostgres: true,
      isLocal: false,
      isNeon: true,
    }
  }

  delete process.env.VERCEL
  const { databaseUrl, databaseUrlUnpooled } = resolveLocalUrls()
  applyToProcessEnv(databaseUrl, databaseUrlUnpooled)

  return {
    target: 'local',
    databaseUrl,
    databaseUrlUnpooled,
    usePostgres: true,
    isLocal: true,
    isNeon: false,
  }
}

export function formatDatabaseStatus(cwd = process.cwd()): string {
  loadEnvFiles(cwd)
  const config = applyDatabaseEnv(cwd)
  const host = (() => {
    try {
      return new URL(config.databaseUrl).host
    } catch {
      return '(invalid url)'
    }
  })()

  return [
    `DB_TARGET=${process.env.DB_TARGET || 'local'}`,
    `resolved=${config.target}`,
    `host=${host}`,
    `databaseUrl=${maskDatabaseUrl(config.databaseUrl)}`,
    `usePostgres=${config.usePostgres}`,
    `isLocal=${config.isLocal}`,
  ].join('\n')
}

export function setDbTargetInEnvFile(
  target: DbTarget,
  envPath = path.join(process.cwd(), '.env'),
) {
  const marker = '# --- Database target (local Windows Postgres vs Neon) ---'
  const line = `DB_TARGET=${target}`

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(
      envPath,
      `${marker}\n${line}\n\nLOCAL_DATABASE_URL=${DEFAULT_LOCAL_URL}\n`,
    )
    return
  }

  let text = fs.readFileSync(envPath, 'utf8')

  if (/^DB_TARGET=.*$/m.test(text)) {
    text = text.replace(/^DB_TARGET=.*$/m, line)
  } else if (text.includes(marker)) {
    text = text.replace(marker, `${marker}\n${line}`)
  } else {
    text = `${marker}\n${line}\n\n${text}`
  }

  if (!/^LOCAL_DATABASE_URL=.*$/m.test(text)) {
    text = text.replace(
      /^DB_TARGET=.*$/m,
      `$&\nLOCAL_DATABASE_URL=${DEFAULT_LOCAL_URL}`,
    )
  }

  fs.writeFileSync(envPath, text.endsWith('\n') ? text : `${text}\n`)
}
