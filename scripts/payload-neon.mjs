import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

// Load .env.neon into process for payload CLI
const envText = fs.readFileSync('.env.neon', 'utf8')
const env = { ...process.env }
for (const line of envText.split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i < 0) continue
  let v = line.slice(i + 1)
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1)
  }
  env[line.slice(0, i)] = v
}

// Prefer direct (unpooled) connection for migrations / DDL
const unpooled = env.DATABASE_URL_UNPOOLED || env.DATABASE_URL
if (!unpooled || unpooled.includes('SENSITIVE') || unpooled.startsWith('file:')) {
  console.error('No usable Neon DATABASE_URL_UNPOOLED')
  process.exit(1)
}

const u = new URL(unpooled)
u.searchParams.delete('channel_binding')
u.searchParams.set('sslmode', 'require')
u.searchParams.set('uselibpqcompat', 'true')
env.DATABASE_URL = u.toString()
// Avoid Vercel-only pooler rewrite during local migrate
delete env.VERCEL
console.log('migrate_host', u.host)

const args = process.argv.slice(2)
const result = spawnSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['exec', 'payload', ...args],
  { env, stdio: 'inherit', shell: true },
)
process.exit(result.status ?? 1)
