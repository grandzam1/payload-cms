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
  const post = await getDocumentBySlug('posts', slug)
  return {
    description: post?.metaDescription || post?.excerpt || undefined,
    title: post?.metaTitle || post?.title || slug,
  }
}

export default async function PostBySlug({ params }: Args) {
  const { slug } = await params
  const post = await getDocumentBySlug('posts', slug)
  if (!post) notFound()

  const { isEnabled } = await draftMode()

  return <ContentView doc={post} showPreviewListener={isEnabled} />
}
