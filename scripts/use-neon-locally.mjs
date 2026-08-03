import fs from 'node:fs'

const neon = fs.readFileSync('.env.neon', 'utf8')
const pick = (t, k) => {
  const m = t.match(new RegExp(`^${k}=(.*)$`, 'm'))
  if (!m) return null
  return m[1].trim().replace(/^["']|["']$/g, '')
}

const unpooled = pick(neon, 'DATABASE_URL_UNPOOLED')
const pooled = pick(neon, 'DATABASE_URL')
const url = unpooled || pooled
if (!url || url.includes('SENSITIVE')) {
  console.error('missing neon url')
  process.exit(1)
}

const u = new URL(url)
u.searchParams.delete('channel_binding')
u.searchParams.set('sslmode', 'require')
u.searchParams.set('uselibpqcompat', 'true')

const local = fs.readFileSync('.env', 'utf8')
const map = Object.fromEntries(
  local
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1)]
    }),
)

map.DATABASE_URL = u.toString()
if (!map.PAYLOAD_SECRET && pick(neon, 'PAYLOAD_SECRET')) {
  map.PAYLOAD_SECRET = pick(neon, 'PAYLOAD_SECRET')
}

const order = [
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_FOLDER',
  'S3_BUCKET',
  'S3_REGION',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_PUBLIC_URL',
]

const lines = order
  .filter((k) => map[k] != null && map[k] !== '')
  .map((k) => `${k}=${map[k]}`)

fs.writeFileSync('.env', lines.join('\n') + '\n')
console.log('LOCAL_ENV_NEON_HOST', u.host)
