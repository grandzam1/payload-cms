import type { CollectionConfig } from 'payload'
import { adminManifest, collectionAdmin } from '../admin/admin.manifest'
import { anyone, authenticated } from '../access'

const resource = adminManifest.collections.posts

export const Posts: CollectionConfig = {
  slug: resource.slug,
  labels: {
    singular: resource.singular,
    plural: resource.plural,
  },
  admin: {
    ...collectionAdmin('posts'),
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
                description: 'Used in the post URL. Example: spring-update',
                placeholder: 'spring-update',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              label: 'Category',
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Excerpt',
              admin: {
                description: 'Short summary shown in listings.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Body',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero image',
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
