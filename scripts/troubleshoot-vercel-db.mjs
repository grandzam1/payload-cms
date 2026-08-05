import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

// Prefer values already in .env.neon / .env.vercel.check for UNPOOLED,
// then ask whether production DATABASE_URL is usable via a small probe script
// executed with `vercel env run` if available.

const files = ['.env.vercel.check', '.env.neon', '.env']
const pick = (t, k) => {
  const m = t.match(new RegExp(`^${k}=(.*)$`, 'm'))
  if (!m) return null
  let v = m[1].trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1)
  }
  if (!v || v === '[SENSITIVE]' || v.includes('SENSITIVE')) return null
  return v
}

let unpooled = null
let pooledFromFile = null
for (const f of files) {
  if (!fs.existsSync(f)) continue
  const t = fs.readFileSync(f, 'utf8')
  unpooled ||= pick(t, 'DATABASE_URL_UNPOOLED')
  const d = pick(t, 'DATABASE_URL')
  if (d?.includes('neon.tech')) pooledFromFile ||= d
}

console.log('--- file evidence ---')
console.log('unpooled_host', unpooled ? new URL(unpooled).host : 'MISSING')
console.log('pooled_from_file_host', pooledFromFile ? new URL(pooledFromFile).host : 'MISSING_OR_REDACTED')

// Simulate what payload.config does on Vercel with UNPOOLED only
if (unpooled) {
  const u = new URL(unpooled)
  u.searchParams.delete('channel_binding')
  u.searchParams.set('sslmode', 'require')
  u.searchParams.set('uselibpqcompat', 'true')
  // Vercel rewrite
  if (u.hostname.endsWith('.neon.tech') && !u.hostname.includes('-pooler')) {
    u.hostname = u.hostname.replace(/^(ep-[a-z0-9-]+)/i, '$1-pooler')
  }
  console.log('--- after resolvePostgresUrl(VERCEL) ---')
  console.log('resolved_host', u.host)
  console.log('resolved_query', u.search)
  console.log('starts_with_postgres', u.toString().startsWith('postgres'))
}

// Check if production DATABASE_URL env is redacted in pull only
const check = fs.existsSync('.env.vercel.check')
  ? fs.readFileSync('.env.vercel.check', 'utf8')
  : ''
const rawDb = pick(check, 'DATABASE_URL')
const rawLine = check.match(/^DATABASE_URL=(.*)$/m)?.[1]
console.log('--- pull quirks ---')
console.log('DATABASE_URL_raw_len', rawLine?.length ?? 0)
console.log('DATABASE_URL_is_literal_SENSITIVE', rawLine?.includes('SENSITIVE') === true)
console.log(
  'PAYLOAD_SECRET_looks_redacted',
  (check.match(/^PAYLOAD_SECRET=(.*)$/m)?.[1] || '').includes('SENSITIVE'),
)

console.log('--- risk ---')
if (rawLine?.includes('SENSITIVE')) {
  console.log(
    'RISK: if Vercel truly stores DATABASE_URL as [SENSITIVE], app will NOT use Postgres (usePostgres=false) unless DATABASE_URL_UNPOOLED is read first. Code order is DATABASE_URL then UNPOOLED — a bad DATABASE_URL blocks fallback.',
  )
} else {
  console.log('DATABASE_URL from pull looks usable or absent')
}

console.log('--- region ---')
console.log('vercel_region fra1, neon_region us-east-2 (latency only, not SSL)')
