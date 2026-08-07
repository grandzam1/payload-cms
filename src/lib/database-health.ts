import 'server-only'

import {
  applyDatabaseEnv,
  isHostedPlatform,
  maskDatabaseUrl,
} from './database-env'

export { isDatabaseError } from './database-error'
export { isHostedPlatform }

export type DatabaseHealth = {
  ok: boolean
  checkedAt: number
  target: string
  host: string
  maskedUrl: string
  latencyMs?: number
  error?: string
  /** True on Vercel/Netlify — Neon is required, no local fallback. */
  productionPlatform: boolean
}

const CACHE_TTL_MS = 20_000
const PROBE_TIMEOUT_MS = 8_000

let cache: DatabaseHealth | null = null
let inFlight: Promise<DatabaseHealth> | null = null

export function isProductionPlatform(): boolean {
  return isHostedPlatform()
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return '(invalid url)'
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Database probe timed out after ${ms}ms`)),
          ms,
        )
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

async function probeNeonServerless(connectionString: string): Promise<void> {
  const { neon } = await import('@neondatabase/serverless')
  const sql = neon(connectionString)
  await sql`select 1 as ok`
}

async function probeNodePg(
  connectionString: string,
  isLocal: boolean,
): Promise<void> {
  const pg = await import('pg')
  const Pool = pg.default?.Pool ?? pg.Pool
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: PROBE_TIMEOUT_MS,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  })

  try {
    await pool.query('select 1 as ok')
  } finally {
    await pool.end().catch(() => undefined)
  }
}

async function runProbe(): Promise<DatabaseHealth> {
  const productionPlatform = isProductionPlatform()
  const started = Date.now()
  const dbEnv = applyDatabaseEnv()
  const url = dbEnv.databaseUrlUnpooled || dbEnv.databaseUrl
  const base = {
    checkedAt: started,
    target: dbEnv.target,
    host: hostFromUrl(url),
    maskedUrl: url ? maskDatabaseUrl(url) : '(missing)',
    productionPlatform,
  }

  if (!url || !url.startsWith('postgres')) {
    return {
      ...base,
      ok: false,
      error: productionPlatform
        ? 'Production requires DATABASE_URL (Neon). Set it in the Vercel/Netlify project env.'
        : 'No Postgres DATABASE_URL configured.',
    }
  }

  // Production hosts must never silently accept a laptop/local Postgres URL.
  try {
    const hostname = new URL(url).hostname
    const localHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === 'host.docker.internal' ||
      hostname.endsWith('.local')

    if (productionPlatform && (dbEnv.isLocal || localHost)) {
      return {
        ...base,
        ok: false,
        error:
          'Production must use Neon, not a local Postgres URL. Check DATABASE_URL on the host.',
      }
    }
  } catch {
    /* ignore parse errors — probe below will fail */
  }

  try {
    await withTimeout(
      productionPlatform || dbEnv.isNeon
        ? probeNeonServerless(url).catch(async (neonErr) => {
            // Prefer Neon serverless on Vercel; elsewhere allow TCP fallback.
            if (process.env.VERCEL) throw neonErr
            await probeNodePg(url, false)
          })
        : probeNodePg(url, dbEnv.isLocal),
      PROBE_TIMEOUT_MS,
    )

    return {
      ...base,
      ok: true,
      latencyMs: Date.now() - started,
      checkedAt: Date.now(),
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown database connection error'

    return {
      ...base,
      ok: false,
      latencyMs: Date.now() - started,
      checkedAt: Date.now(),
      error: message,
    }
  }
}

/** Cached SELECT 1 probe. Safe to call from RSC / route handlers. */
export async function getDatabaseHealth(
  options: { force?: boolean } = {},
): Promise<DatabaseHealth> {
  if (!options.force && cache && Date.now() - cache.checkedAt < CACHE_TTL_MS) {
    return cache
  }

  if (!options.force && inFlight) return inFlight

  inFlight = runProbe()
    .then((result) => {
      cache = result
      return result
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}

export function clearDatabaseHealthCache() {
  cache = null
}
