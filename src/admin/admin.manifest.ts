/**
 * ADMIN SOURCE OF TRUTH
 * ---------------------
 * Edit THIS file to change admin layout, labels, nav groups, and dashboard.
 * Collections/globals/dashboard/CSS brand copy should read from here — do not
 * hardcode parallel labels elsewhere.
 *
 * How to use:
 * 1. Change `navGroups` order/labels → sidebar sections update
 * 2. Change a resource under `collections` / `globals` → list headers & groups update
 * 3. Change `dashboard` → Studio home widgets update
 * 4. Change `brand` → title suffix, login, icon/logo text update
 *
 * After edits that add/remove collections or fields, run:
 *   pnpm payload migrate:create
 *   pnpm payload migrate
 *   pnpm generate:importmap && pnpm generate:types
 */

export type NavGroupId = 'content' | 'media' | 'system'

export type AdminCollectionKey = 'pages' | 'posts' | 'categories' | 'media' | 'users'

export type AdminGlobalKey = 'siteSettings'

export type AdminResourceKind = 'collection' | 'global'

export type AdminResource = {
  kind: AdminResourceKind
  /** Payload slug */
  slug: string
  singular: string
  plural: string
  groupId: NavGroupId
  description: string
  /** Collection-only */
  useAsTitle?: string
  defaultColumns?: string[]
  listSearchableFields?: string[]
  /** Shown on dashboard stats strip */
  showOnDashboard?: boolean
  /** Quick-create action on dashboard */
  quickCreate?: boolean
}

export const adminManifest = {
  brand: {
    name: 'Content Studio',
    shortName: 'Studio',
    titleSuffix: '— Content Studio',
    tagline: 'Manage pages, posts, media, and settings — no coding needed.',
    loginTitle: 'Sign in to Content Studio',
    loginHelp:
      'Enter your team email and password. After sign-in you land on a simple dashboard with clear shortcuts.',
  },

  /**
   * Sidebar section order (Filament-style groups).
   * `label` is what Payload shows via collection/global `admin.group`.
   */
  navGroups: [
    { id: 'content' as const, label: 'Content', order: 1 },
    { id: 'media' as const, label: 'Media', order: 2 },
    { id: 'system' as const, label: 'System', order: 3 },
  ],

  collections: {
    pages: {
      kind: 'collection' as const,
      slug: 'pages',
      singular: 'Page',
      plural: 'Pages',
      groupId: 'content' as const,
      description: 'Static site pages such as Home, About, and Contact.',
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', 'updatedAt'],
      listSearchableFields: ['title', 'slug'],
      showOnDashboard: true,
      quickCreate: true,
    },
    posts: {
      kind: 'collection' as const,
      slug: 'posts',
      singular: 'Post',
      plural: 'Posts',
      groupId: 'content' as const,
      description: 'Articles and news items published on the site.',
      useAsTitle: 'title',
      defaultColumns: ['title', 'category', 'updatedAt'],
      listSearchableFields: ['title', 'slug'],
      showOnDashboard: true,
      quickCreate: true,
    },
    categories: {
      kind: 'collection' as const,
      slug: 'categories',
      singular: 'Category',
      plural: 'Categories',
      groupId: 'content' as const,
      description: 'Group posts by topic for clearer navigation.',
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', 'updatedAt'],
      listSearchableFields: ['title', 'slug'],
      showOnDashboard: true,
      quickCreate: false,
    },
    media: {
      kind: 'collection' as const,
      slug: 'media',
      singular: 'Photo or File',
      plural: 'Photos & Files',
      groupId: 'media' as const,
      description:
        'Upload pictures and PDFs here. Always add a short description so the file is easy to find later.',
      useAsTitle: 'filename',
      defaultColumns: ['filename', 'alt', 'updatedAt'],
      showOnDashboard: true,
      quickCreate: true,
    },
    users: {
      kind: 'collection' as const,
      slug: 'users',
      singular: 'Team Member',
      plural: 'Team Members',
      groupId: 'system' as const,
      description: 'People who can sign in. Add someone only when they need access.',
      useAsTitle: 'name',
      defaultColumns: ['name', 'email', 'updatedAt'],
      listSearchableFields: ['name', 'email'],
      showOnDashboard: true,
      quickCreate: false,
    },
  } satisfies Record<AdminCollectionKey, AdminResource>,

  globals: {
    siteSettings: {
      kind: 'global' as const,
      slug: 'site-settings',
      singular: 'Site Settings',
      plural: 'Site Settings',
      groupId: 'system' as const,
      description: 'Site-wide name, tagline, and default SEO.',
      showOnDashboard: false,
      quickCreate: false,
    },
  } satisfies Record<AdminGlobalKey, AdminResource>,

  dashboard: {
    eyebrow: 'Overview',
    title: 'Dashboard',
    lede: 'Jump into content, media, or settings. Everything is grouped in the sidebar.',
  },
} as const

export type AdminManifest = typeof adminManifest

export function navGroupLabel(groupId: NavGroupId): string {
  const group = adminManifest.navGroups.find((g) => g.id === groupId)
  return group?.label ?? groupId
}

export function collectionAdmin(key: AdminCollectionKey) {
  const resource = adminManifest.collections[key]
  return {
    useAsTitle: resource.useAsTitle,
    defaultColumns: resource.defaultColumns ? [...resource.defaultColumns] : undefined,
    group: navGroupLabel(resource.groupId),
    description: resource.description,
    listSearchableFields: resource.listSearchableFields
      ? [...resource.listSearchableFields]
      : undefined,
  }
}

export function globalAdmin(key: AdminGlobalKey) {
  const resource = adminManifest.globals[key]
  return {
    group: navGroupLabel(resource.groupId),
    description: resource.description,
  }
}

export function dashboardStatResources() {
  return (Object.keys(adminManifest.collections) as AdminCollectionKey[])
    .map((key) => adminManifest.collections[key])
    .filter((resource) => resource.showOnDashboard)
}

export function dashboardQuickCreates() {
  return (Object.keys(adminManifest.collections) as AdminCollectionKey[])
    .map((key) => adminManifest.collections[key])
    .filter((resource) => resource.quickCreate)
    .map((resource) => ({
      label: `New ${resource.singular.toLowerCase()}`,
      href: `/admin/collections/${resource.slug}/create`,
      plural: resource.plural,
      description: resource.description,
    }))
}

export function collectionListPath(slug: string) {
  return `/admin/collections/${slug}`
}

export function globalPath(slug: string) {
  return `/admin/globals/${slug}`
}
