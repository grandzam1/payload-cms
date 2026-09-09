import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { ContentView } from '@/components/ContentView'
import { getDocumentBySlug } from '@/lib/getDocument'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await getDocumentBySlug('pages', slug)
  return {
    description: page?.metaDescription || undefined,
    title: page?.metaTitle || page?.title || slug,
  }
}

export default async function PageBySlug({ params }: Args) {
  const { slug } = await params

  // Reserved for the posts route group
  if (slug === 'posts' || slug === 'next' || slug === 'api' || slug === 'admin') {
    notFound()
  }

  const page = await getDocumentBySlug('pages', slug)
  if (!page) notFound()

  const { isEnabled } = await draftMode()

  return <ContentView doc={page} showPreviewListener={isEnabled} />
}
