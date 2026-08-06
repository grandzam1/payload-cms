import { getPayload } from 'payload'
import config from '../src/payload.config'
import { applyDatabaseEnv } from '../src/lib/database-env'

applyDatabaseEnv()

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
