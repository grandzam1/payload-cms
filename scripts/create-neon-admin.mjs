import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const envText = fs.readFileSync('.env', 'utf8')
for (const line of envText.split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue
  const i = line.indexOf('=')
  if (i < 0) continue
  process.env[line.slice(0, i)] = line.slice(i + 1).replace(/^["']|["']$/g, '')
}

const u = new URL(process.env.DATABASE_URL)
u.searchParams.delete('channel_binding')
u.searchParams.set('sslmode', 'require')
u.searchParams.set('uselibpqcompat', 'true')
process.env.DATABASE_URL = u.toString()
delete process.env.VERCEL

const email = process.env.ADMIN_EMAIL || 'admin@admin.com'
const password = process.env.ADMIN_PASSWORD || 'admin@admin.com'

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 10,
  overrideAccess: true,
})

for (const doc of existing.docs) {
  await payload.delete({ collection: 'users', id: doc.id, overrideAccess: true })
  console.log('DELETED', doc.id, doc.email)
}

const created = await payload.create({
  collection: 'users',
  data: { email, password, name: 'Admin' },
  overrideAccess: true,
})
console.log('CREATED', created.id, created.email)

const login = await payload.login({
  collection: 'users',
  data: { email, password },
})
console.log('LOGIN_OK', Boolean(login.token), login.user?.email)

process.exit(0)
