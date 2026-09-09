'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import './preview-controls-hint.scss'

/** Compact hint beside document controls when Live Preview cannot appear yet. */
export default function PreviewControlsHint() {
  const slug = useFormFields(([fields]) => {
    const value = fields.slug?.value
    return typeof value === 'string' ? value.trim() : ''
  })

  if (slug) return null

  return (
    <span className="preview-controls-hint" role="status">
      Add a URL slug to unlock Live Preview
    </span>
  )
}
