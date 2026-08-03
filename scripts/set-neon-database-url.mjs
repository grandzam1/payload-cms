/**
 * Copy DATABASE_URL_UNPOOLED → DATABASE_URL for Vercel production/preview,
 * using the direct Neon host (no -pooler rewrite) and SSL-safe query params.
 *
 * Usage: node scripts/set-neon-database-url.mjs
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const envFile = '.env.neon'
const text = fs.readFileSync(envFile, 'utf8')
const match = text.match(/^DATABASE_URL_UNPOOLED=(.*)$/m)
if (!match) {
  console.error('DATABASE_URL_UNPOOLED missing in', envFile)
  process.exit(1)
}

let value = match[1].trim()
if (
  (value.startsWith('"') && value.endsWith('"')) ||
  (value.startsWith("'") && value.endsWith("'"))
) {
  value = value.slice(1, -1)
}

const u = new URL(value)
u.searchParams.delete('channel_binding')
u.searchParams.set('sslmode', 'require')
u.searchParams.set('uselibpqcompat', 'true')
// Keep the direct Neon host — do not force -pooler

const databaseUrl = u.toString()
console.log('target_host', u.host)

const vercel =
  process.platform === 'win32'
    ? '.\\node_modules\\.bin\\vercel.CMD'
    : './node_modules/.bin/vercel'

for (const envName of ['production', 'preview', 'development']) {
  spawnSync(vercel, ['env', 'rm', 'DATABASE_URL', envName, '--yes'], {
    stdio: 'ignore',
    shell: true,
  })
  const add = spawnSync(
    vercel,
    ['env', 'add', 'DATABASE_URL', envName, '--yes'],
    {
      input: databaseUrl,
      encoding: 'utf8',
      shell: true,
    },
  )
  const out = `${add.stdout || ''}${add.stderr || ''}`
  console.log(
    envName,
    /Added|Updated|Error|already/i.test(out)
      ? out.match(/Added|Updated|Error|already[^\n]*/i)?.[0]
      : add.status,
  )
}

const updated = text.includes('DATABASE_URL=')
  ? text.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${databaseUrl}"`)
  : `DATABASE_URL="${databaseUrl}"\n${text}`
fs.writeFileSync(envFile, updated)
console.log('LOCAL_ENV_UPDATED')
