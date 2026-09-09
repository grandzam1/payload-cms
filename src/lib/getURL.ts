/**
 * Public site URL for CORS, Live Preview, and client components.
 * Set NEXT_PUBLIC_SERVER_URL in .env (e.g. http://localhost:3000).
 */
export function getServerSideURL(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  )
}

export function getClientSideURL(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return getServerSideURL()
}

export function getPreviewPath(args: {
  collection: 'pages' | 'posts'
  slug: string
}): string | null {
  const { collection, slug } = args
  const clean = slug?.trim()
  if (!clean) return null

  if (collection === 'posts') return `/posts/${clean}`
  if (clean === 'home') return '/'
  return `/${clean}`
}
