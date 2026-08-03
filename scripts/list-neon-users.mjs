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

console.log('host', u.host)
const payload = await getPayload({ config })
const users = await payload.find({ collection: 'users', limit: 10 })
console.log('userCount', users.totalDocs)
for (const d of users.docs) console.log('user', d.id, d.email)
process.exit(0)
