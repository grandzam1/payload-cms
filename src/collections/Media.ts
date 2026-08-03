import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo or File',
    plural: 'Photos & Files',
  },
  admin: {
    group: 'Your content',
    description:
      'Upload pictures and documents here. You can reuse them anywhere on your site later.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Short description',
      required: true,
      admin: {
        description:
          'Describe what is in the image in plain words. This helps visitors who cannot see the picture, and improves search.',
        placeholder: 'A blue coffee mug on a wooden table',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
