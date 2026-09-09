/** Shared beginner-friendly copy for Pages / Posts schemas. */
export const fieldHelp = {
  title: {
    label: 'Title',
    description: 'The name people see first. Keep it short and clear.',
  },
  slug: {
    label: 'URL slug',
    description:
      'The web address piece (example: about). Required for Live Preview. If you leave it blank, we create one from the title when you save.',
    placeholder: 'about',
    postPlaceholder: 'spring-update',
  },
  body: {
    label: 'Body',
    description: 'Write your content here. Tap / for formatting shortcuts.',
  },
  excerpt: {
    label: 'Excerpt',
    description: 'A short summary for lists and previews (1–2 sentences).',
  },
  category: {
    label: 'Category',
    description: 'Optional. Helps group similar posts so visitors can find them.',
  },
  heroImage: {
    label: 'Hero image',
    description: 'Optional cover picture shown at the top of the post.',
  },
  metaTitle: {
    label: 'Meta title',
    description: 'Optional. Shown in browser tabs and Google. Leave blank to use the Title.',
  },
  metaDescription: {
    label: 'Meta description',
    description: 'Optional. Short blurb for search results. Aim for about 150 characters.',
  },
  draftWorkflow: {
    description:
      'Draft = only you can see it. Publish = live on the site. Use Live Preview to check before publishing.',
  },
} as const
