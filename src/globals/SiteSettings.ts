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
      ],
    },
  ],
}
