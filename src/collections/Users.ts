import type { CollectionConfig } from 'payload'
import { adminManifest, collectionAdmin } from '../admin/admin.manifest'
import { authenticated } from '../access'

const resource = adminManifest.collections.users

export const Users: CollectionConfig = {
  slug: resource.slug,
  labels: {
    singular: resource.singular,
    plural: resource.plural,
  },
  admin: {
    ...collectionAdmin('users'),
  },
  auth: {
    // Avoid session-table writes on every login (can hang behind poolers on Vercel)
    useSessions: false,
    tokenExpiration: 7200,
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
      admin: {
        description: 'Display name shown in the admin panel.',
        placeholder: 'Sam Rivera',
      },
    },
  ],
}
