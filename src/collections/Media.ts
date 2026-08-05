import type { CollectionConfig } from 'payload'
import { adminManifest, collectionAdmin } from '../admin/admin.manifest'
import { anyone, authenticated } from '../access'

const resource = adminManifest.collections.media

export const Media: CollectionConfig = {
  slug: resource.slug,
  labels: {
    singular: resource.singular,
    plural: resource.plural,
  },
  admin: {
    ...collectionAdmin('media'),
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Short description',
      required: true,
      admin: {
        description:
          'Say what is in the image in plain words. Required so visitors and search engines understand the file.',
        placeholder: 'Blue coffee mug on a wooden table',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
