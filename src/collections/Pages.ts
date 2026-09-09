import type { CollectionConfig } from 'payload'
import { adminManifest, collectionAdmin } from '../admin/admin.manifest'
import { fieldHelp } from '../admin/fieldHelp'
import { authenticated, authenticatedOrPublished } from '../access'
import { populateSlug } from '../hooks/populateSlug'

const resource = adminManifest.collections.pages

export const Pages: CollectionConfig = {
  slug: resource.slug,
  labels: {
    singular: resource.singular,
    plural: resource.plural,
  },
  admin: {
    ...collectionAdmin('pages'),
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
                placeholder: fieldHelp.slug.placeholder,
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
              name: 'blocks',
              type: 'blocks',
              label: 'Blocks',
              labels: {
                singular: 'Block',
                plural: 'Blocks',
              },
              admin: {
                description: 'Ordered page sections rendered by the frontend.',
              },
              blocks: [
                {
                  slug: 'callout',
                  labels: {
                    singular: 'Callout',
                    plural: 'Callouts',
                  },
                  fields: [
                    {
                      name: 'content',
                      type: 'richText',
                      label: 'Content',
                      admin: {
                        description: 'Intro paragraph(s) for this callout.',
                      },
                    },
                  ],
                },
                {
                  slug: 'heading',
                  labels: {
                    singular: 'Heading',
                    plural: 'Headings',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      label: 'Heading',
                    },
                    {
                      name: 'subheading',
                      type: 'text',
                      label: 'Subheading',
                      admin: {
                        description: 'Optional supporting line under the heading.',
                      },
                    },
                  ],
                },
                {
                  slug: 'bullets',
                  labels: {
                    singular: 'Bullets',
                    plural: 'Bullets',
                  },
                  fields: [
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Items',
                      labels: {
                        singular: 'Item',
                        plural: 'Items',
                      },
                      minRows: 1,
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                          label: 'Text',
                        },
                      ],
                    },
                  ],
                },
                {
                  slug: 'spacer',
                  labels: {
                    singular: 'Spacer',
                    plural: 'Spacers',
                  },
                  fields: [
                    {
                      name: 'size',
                      type: 'select',
                      label: 'Size',
                      defaultValue: 'medium',
                      options: [
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                      ],
                      admin: {
                        description: 'Optional vertical space height.',
                      },
                    },
                  ],
                },
                {
                  slug: 'pricing',
                  labels: {
                    singular: 'Pricing',
                    plural: 'Pricing',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Title',
                    },
                    {
                      name: 'price',
                      type: 'text',
                      label: 'Price',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Description',
                    },
                  ],
                },
                {
                  slug: 'reviews',
                  labels: {
                    singular: 'Reviews',
                    plural: 'Reviews',
                  },
                  fields: [
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Items',
                      labels: {
                        singular: 'Review',
                        plural: 'Reviews',
                      },
                      minRows: 1,
                      fields: [
                        {
                          name: 'avatar',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Avatar',
                        },
                        {
                          name: 'stars',
                          type: 'text',
                          label: 'Stars',
                          defaultValue: '★★★★★',
                          admin: {
                            description: 'Display string for the rating (e.g. ★★★★★).',
                          },
                        },
                        {
                          name: 'quote',
                          type: 'textarea',
                          required: true,
                          label: 'Quote',
                        },
                        {
                          name: 'attribution',
                          type: 'text',
                          required: true,
                          label: 'Attribution',
                          admin: {
                            description: 'Reviewer name and optional role (e.g. Maya, founder).',
                            placeholder: 'Maya, founder',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  slug: 'access_tier',
                  labels: {
                    singular: 'Access Tier',
                    plural: 'Access Tiers',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Title',
                    },
                    {
                      name: 'audience',
                      type: 'textarea',
                      required: true,
                      label: 'Audience',
                    },
                    {
                      name: 'included',
                      type: 'text',
                      hasMany: true,
                      required: true,
                      label: 'Included',
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      label: 'Image',
                    },
                    {
                      name: 'imageAlt',
                      type: 'text',
                      required: true,
                      label: 'Image alt',
                    },
                    {
                      name: 'headingLevel',
                      type: 'number',
                      label: 'Heading level',
                      min: 1,
                      max: 2,
                      admin: {
                        description: 'Optional. 1 or 2. Frontend defaults to 2.',
                        step: 1,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Appearance',
          description: 'Page chrome shown above the blocks.',
          fields: [
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover',
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon',
            },
            {
              name: 'titleImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Title image',
              admin: {
                description: 'Logo/title image rendered as the page heading.',
              },
            },
            {
              name: 'theme',
              type: 'select',
              label: 'Theme',
              defaultValue: 'v2',
              options: [
                { label: 'Notion document', value: 'notion' },
                { label: 'v2', value: 'v2' },
              ],
              admin: {
                description: 'Public theme ids from the reference frontend (notion, v2).',
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
