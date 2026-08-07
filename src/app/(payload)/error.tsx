'use client'

import React from 'react'

import { DatabaseUnavailable } from '@/components/DatabaseUnavailable'
import { isDatabaseError } from '@/lib/database-error'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PayloadError({ error, reset }: Props) {
  const db = isDatabaseError(error)

  return (
    <DatabaseUnavailable
      title={db ? 'Database unavailable' : 'Admin failed to load'}
      detail={
        db
          ? error.message
          : error.message || 'The admin UI hit an unexpected error.'
      }
      productionPlatform={
        typeof window !== 'undefined' &&
        /vercel\.app$|netlify\.app$/i.test(window.location.hostname)
      }
      onRetry={reset}
    />
  )
}
