import fs from 'node:fs'

const file = process.argv[2] || '.env.vercel.check'
const t = fs.readFileSync(file, 'utf8')
const keys = [
  'DATABASE_URL',
  'DATABASE_URL_UNPOOLED',
  'PAYLOAD_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'POSTGRES_URL',
  'POSTGRES_HOST',
]

for (const k of keys) {
  const m = t.match(new RegExp(`^${k}=(.*)$`, 'm'))
  if (!m) {
    console.log(`${k}: MISSING`)
    continue
  }
  let v = m[1].trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1)
  }

  if (k === 'PAYLOAD_SECRET' || k === 'CLOUDINARY_CLOUD_NAME') {
    console.log(`${k}: SET len=${v.length}`)
    continue
  }

  const bad = v.includes('SENSITIVE') || v.length < 20
  let host = '?'
  let search = ''
  try {
    const u = new URL(v)
    host = u.host
    search = u.search
  } catch {
    /* ignore */
  }

  console.log(
    `${k}: ${bad ? 'BAD_OR_PLACEHOLDER' : 'ok'} host=${host} neon=${v.includes('neon.tech')} supabase=${v.includes('supabase')} pooler=${host.includes('-pooler') || host.includes('pooler')} channel_binding=${v.includes('channel_binding')} uselibpqcompat=${v.includes('uselibpqcompat')} sslmode=${/sslmode=([^&]+)/.exec(v)?.[1] || 'none'}`,
  )
}
