'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * Listens for admin autosave/publish and refreshes the App Router route
 * so Live Preview stays in sync (server-side pattern).
 */
export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')

  if (!serverURL) return null

  return (
    <PayloadLivePreview
      refresh={() => router.refresh()}
      serverURL={serverURL}
    />
  )
}
