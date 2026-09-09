import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Media, Page, Post } from '@/payload-types'

type ContentDoc = Pick<Page, 'title' | 'content'> &
  Partial<Pick<Post, 'excerpt' | 'heroImage'>>

function hasLexicalRoot(
  content: ContentDoc['content'],
): content is NonNullable<ContentDoc['content']> {
  return Boolean(content && typeof content === 'object' && 'root' in content)
}

export function ContentView({
  doc,
  showPreviewListener,
}: {
  doc: ContentDoc
  showPreviewListener?: boolean
}) {
  const hero =
    doc.heroImage && typeof doc.heroImage === 'object' ? doc.heroImage : null

  return (
    <article className="content-doc">
      {showPreviewListener ? <LivePreviewListener /> : null}
      <h1>{doc.title || 'Untitled'}</h1>
      {doc.excerpt ? <p className="excerpt">{doc.excerpt}</p> : null}
      {hero?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={hero.alt || doc.title || ''}
          className="hero"
          src={hero.url}
        />
      ) : null}
      {hasLexicalRoot(doc.content) ? <RichText data={doc.content} /> : null}
    </article>
  )
}
