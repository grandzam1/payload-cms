'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import './preview-guide.scss'

/**
 * Beginner feedback banner on Pages/Posts edit screens.
 * Explains Draft vs Publish and why Live Preview may be missing.
 */
export default function PreviewGuide() {
  const slug = useFormFields(([fields]) => {
    const value = fields.slug?.value
    return typeof value === 'string' ? value.trim() : ''
  })
  const status = useFormFields(([fields]) => {
    const value = fields._status?.value
    return typeof value === 'string' ? value : 'draft'
  })

  const hasSlug = Boolean(slug)
  const isDraft = status !== 'published'
  const isPost =
    typeof window !== 'undefined' && window.location.pathname.includes('/collections/posts/')
  const previewPath = hasSlug ? (isPost ? `/posts/${slug}` : `/${slug}`) : ''

  return (
    <aside
      className={`preview-guide ${hasSlug ? 'preview-guide--ready' : 'preview-guide--blocked'}`}
      aria-live="polite"
    >
      <p className="preview-guide__eyebrow">
        {isDraft ? 'Draft — not on the live site yet' : 'Published — visible on the live site'}
      </p>

      {hasSlug ? (
        <>
          <p className="preview-guide__title">Live Preview is ready</p>
          <p className="preview-guide__text">
            Tap <strong>Live Preview</strong> at the top to see how this looks on phone, tablet, or
            desktop — without publishing.
          </p>
          <p className="preview-guide__path">
            Preview path: <code>{previewPath}</code>
          </p>
        </>
      ) : (
        <>
          <p className="preview-guide__title">Add a URL slug to unlock Live Preview</p>
          <p className="preview-guide__text">
            Fill in <strong>URL slug</strong> below (or just save — we can create one from the
            title). Until then, the Live Preview button stays hidden so the preview has a real
            address.
          </p>
        </>
      )}

      <ul className="preview-guide__steps">
        <li>
          <strong>Draft</strong> = safe to edit; visitors cannot see it.
        </li>
        <li>
          <strong>Live Preview</strong> = check your work first.
        </li>
        <li>
          <strong>Publish changes</strong> = make it live when you are happy.
        </li>
      </ul>
    </aside>
  )
}
