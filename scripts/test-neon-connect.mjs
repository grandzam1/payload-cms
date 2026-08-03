import fs from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pg = require('pg')

const envFile = process.argv[2] || '.env.neon'
const text = fs.readFileSync(envFile, 'utf8')
const pick = (key) => {
  const m = text.match(new RegExp(`^${key}=(.*)$`, 'm'))
  if (!m) return null
  return m[1].trim().replace(/^["']|["']$/g, '')
}

const raw = pick('DATABASE_URL_UNPOOLED') || pick('DATABASE_URL')
if (!raw || raw.includes('SENSITIVE') || raw.startsWith('file:')) {
  console.error('No usable Postgres URL in', envFile)
  process.exit(1)
}

const u = new URL(raw)
u.searchParams.delete('channel_binding')
u.searchParams.set('sslmode', 'require')
u.searchParams.set('uselibpqcompat', 'true')

console.log('host', u.host)

const pool = new pg.Pool({
  connectionString: u.toString(),
  max: 1,
  connectionTimeoutMillis: 30000,
  ssl: { rejectUnauthorized: false },
})

const t0 = Date.now()
try {
  const client = await pool.connect()
  const r = await client.query(
    `select current_database() as db, (select count(*)::int from information_schema.tables where table_schema='public') as tables`,
  )
  console.log('OK', Date.now() - t0 + 'ms', r.rows[0])
  client.release()
} catch (e) {
  console.error('FAIL', Date.now() - t0 + 'ms', e.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
