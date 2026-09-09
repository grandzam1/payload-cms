import type { CollectionConfig } from 'payload'
import { adminManifest, collectionAdmin } from '../admin/admin.manifest'
import { fieldHelp } from '../admin/fieldHelp'
import { authenticated, authenticatedOrPublished } from '../access'
import { populateSlug } from '../hooks/populateSlug'

const resource = adminManifest.collections.posts

export const Posts: CollectionConfig = {
  slug: resource.slug,
  labels: {
    singular: resource.singular,
    plural: resource.plural,
  },
  admin: {
    ...collectionAdmin('posts'),
    components: {
      edit: {
        beforeDocumentControls: ['/components/admin/PreviewControlsHint'],
      },
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
  },
  hooks: {
    beforeValidate: [populateSlug],
  },
  access: {
    read: authenticatedOrPublished,
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
          description: fieldHelp.draftWorkflow.description,
          fields: [
            {
              name: 'previewGuide',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/PreviewGuide',
                },
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: fieldHelp.title.label,
              admin: {
                description: fieldHelp.title.description,
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: fieldHelp.slug.label,
              admin: {
                description: fieldHelp.slug.description,
                placeholder: fieldHelp.slug.postPlaceholder,
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              label: fieldHelp.category.label,
              admin: {
                description: fieldHelp.category.description,
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: fieldHelp.excerpt.label,
              admin: {
                description: fieldHelp.excerpt.description,
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: fieldHelp.body.label,
              admin: {
                description: fieldHelp.body.description,
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: fieldHelp.heroImage.label,
              admin: {
                description: fieldHelp.heroImage.description,
              },
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Optional search-engine details. Safe to skip while drafting.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: fieldHelp.metaTitle.label,
              admin: {
                description: fieldHelp.metaTitle.description,
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: fieldHelp.metaDescription.label,
              admin: {
                description: fieldHelp.metaDescription.description,
              },
            },
          ],
        },
      ],
    },
  ],
}
