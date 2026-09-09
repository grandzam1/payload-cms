import type { CollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getPreviewPath } from '@/lib/getURL'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug | null
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret.', { status: 403 })
  }

  if (!path || !collection || !slug || !slug.trim()) {
    return new Response('Missing path, collection, or slug.', { status: 400 })
  }

  if (!path.startsWith('/')) {
    return new Response('Invalid path.', { status: 400 })
  }

  if (collection !== 'pages' && collection !== 'posts') {
    return new Response('Collection not allowed for preview.', { status: 400 })
  }

  // Ensure the document exists (draft or published) before enabling draft mode
  const payload = await getPayload({ config })

  const where = {
    slug: {
      equals: slug,
    },
  }

  let result = await payload.find({
    collection,
    draft: true,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where,
  })

  // Docs created before drafts were enabled may lack version rows
  if (!result.docs.length) {
    result = await payload.find({
      collection,
      draft: false,
      limit: 1,
      pagination: false,
      overrideAccess: true,
      where,
    })
  }

  if (!result.docs.length) {
    return new Response('Document not found.', { status: 404 })
  }

  const expectedPath = getPreviewPath({
    collection,
    slug,
  })

  if (!expectedPath || path !== expectedPath) {
    return new Response('Path does not match document.', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
