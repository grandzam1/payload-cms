const keys = Object.keys(process.env)
  .filter((k) =>
    /^(DATABASE|POSTGRES|PAYLOAD|CLOUDINARY|S3_|VERCEL)/.test(k),
  )
  .sort()

for (const k of keys) {
  const v = process.env[k] || ''
  let extra = `len=${v.length}`
  if (/URL|HOST|ENDPOINT/.test(k)) {
    try {
      const u = new URL(v)
      extra += ` host=${u.host} neon=${v.includes('neon.tech')} supabase=${v.includes('supabase')} pooler=${u.host.includes('pooler')} channel=${v.includes('channel_binding')}`
    } catch {
      extra += ` parse=fail head=${JSON.stringify(v.slice(0, 24))}`
    }
  }
  console.log(`${k}: ${extra}`)
}

const db = process.env.DATABASE_URL || ''
const unpooled = process.env.DATABASE_URL_UNPOOLED || ''
console.log('--- verdict ---')
console.log('DATABASE_URL_present', Boolean(db))
console.log('usePostgres_from_DATABASE_URL', db.startsWith('postgres'))
console.log(
  'usePostgres_with_fallback',
  (db || unpooled).startsWith('postgres'),
)
console.log(
  'code_fallback_works_only_if_DATABASE_URL_empty',
  !db && unpooled.startsWith('postgres'),
)
if (db && !db.startsWith('postgres')) {
  console.log(
    'BLOCKER: DATABASE_URL is set but not postgres — blocks UNPOOLED fallback',
  )
}
if (!db && unpooled.startsWith('postgres')) {
  console.log('OK_PATH: DATABASE_URL empty, app can use DATABASE_URL_UNPOOLED')
}
