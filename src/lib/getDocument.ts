import type { CollectionSlug, DataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

type PreviewCollection = 'pages' | 'posts'

export async function getDocumentBySlug<T extends PreviewCollection>(
  collection: T,
  slug: string,
): Promise<DataFromCollectionSlug<T> | null> {
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: collection as CollectionSlug,
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: isDraftMode,
    draft: isDraftMode,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const doc = result.docs[0] as DataFromCollectionSlug<T> | undefined
  if (doc) return doc

  // Fallback: docs created before drafts may have no version rows yet
  if (isDraftMode) {
    const published = await payload.find({
      collection: collection as CollectionSlug,
      depth: 1,
      limit: 1,
      pagination: false,
      overrideAccess: true,
      draft: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
    return (published.docs[0] as DataFromCollectionSlug<T> | undefined) ?? null
  }

  return null
}
