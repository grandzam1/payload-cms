import type { CollectionConfig } from 'payload'
import { adminManifest, collectionAdmin } from '../admin/admin.manifest'
import { anyone, authenticated } from '../access'

const resource = adminManifest.collections.categories

export const Categories: CollectionConfig = {
  slug: resource.slug,
  labels: {
    singular: resource.singular,
    plural: resource.plural,
  },
  admin: {
    ...collectionAdmin('categories'),
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL slug',
      admin: {
        description: 'Used in category URLs. Example: news',
        placeholder: 'news',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
}
