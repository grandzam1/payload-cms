import type { GlobalConfig } from 'payload'
import { adminManifest, globalAdmin } from '../admin/admin.manifest'
import { authenticated } from '../access'

const resource = adminManifest.globals.siteSettings

export const SiteSettings: GlobalConfig = {
  slug: resource.slug,
  label: resource.singular,
  admin: {
    ...globalAdmin('siteSettings'),
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              label: 'Site name',
              defaultValue: 'Content Studio',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
            },
          ],
        },
        {
          label: 'SEO defaults',
          fields: [
            {
              name: 'defaultMetaTitle',
              type: 'text',
              label: 'Default meta title',
            },
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              label: 'Default meta description',
            },
          ],
        },
        {
          label: 'Marquee',
          fields: [
            {
              name: 'marquee',
              type: 'group',
              label: false,
              admin: {
                hideGutter: true,
                components: {
                  Field: '/components/admin/marquee/MarqueeField',
                },
              },
              fields: [
                {
                  name: 'duration',
                  type: 'number',
                  label: 'Duration',
                  defaultValue: 40,
                  min: 5,
                  max: 60,
                  admin: {
                    step: 1,
                    hidden: true,
                  },
                },
                {
                  name: 'logoSize',
                  type: 'number',
                  label: 'Logo size',
                  defaultValue: 48,
                  min: 16,
                  max: 64,
                  admin: {
                    step: 1,
                    hidden: true,
                  },
                },
                {
                  name: 'direction',
                  type: 'select',
                  label: 'Direction',
                  defaultValue: 'rtl',
                  options: [
                    { label: 'Right to left', value: 'rtl' },
                    { label: 'Left to right', value: 'ltr' },
                  ],
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'isPlaying',
                  type: 'checkbox',
                  label: 'Is playing',
                  defaultValue: true,
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'includedCompanies',
                  type: 'select',
                  hasMany: true,
                  label: 'Included companies',
                  defaultValue: ['neuralink', 'grok', 'spacex', 'tesla', 'boring', 'x'],
                  options: [
                    { label: 'Neuralink', value: 'neuralink' },
                    { label: 'Grok', value: 'grok' },
                    { label: 'SpaceX', value: 'spacex' },
                    { label: 'Tesla', value: 'tesla' },
                    { label: 'The Boring Company', value: 'boring' },
                    { label: 'X', value: 'x' },
                  ],
                  admin: {
                    hidden: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
