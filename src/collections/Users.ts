import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Team Member',
    plural: 'Team Members',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'updatedAt'],
    group: 'Your team',
    description:
      'People who can sign in and manage your website. Add a teammate when someone else needs access.',
    listSearchableFields: ['name', 'email'],
  },
  auth: {
    // Avoid session-table writes on every login (can hang behind Supabase poolers on Vercel)
    useSessions: false,
    tokenExpiration: 7200,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
      admin: {
        description: 'A friendly name so you can tell people apart (example: Sam Rivera).',
        placeholder: 'Sam Rivera',
      },
    },
    // Email & password are added automatically by auth: true
  ],
}
