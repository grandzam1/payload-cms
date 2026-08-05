import type { CollectionConfig } from 'payload'
import { adminManifest, collectionAdmin } from '../admin/admin.manifest'
import { anyone, authenticated } from '../access'

const resource = adminManifest.collections.pages

export const Pages: CollectionConfig = {
  slug: resource.slug,
  labels: {
    singular: resource.singular,
    plural: resource.plural,
  },
  admin: {
    ...collectionAdmin('pages'),
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
                description: 'Used in the page URL. Example: about',
                placeholder: 'about',
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Body',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta title',
              admin: {
                description: 'Shown in browser tabs and search results.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta description',
            },
          ],
        },
      ],
    },
  ],
}
