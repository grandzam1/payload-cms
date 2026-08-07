'use client'

import React from 'react'

import { DatabaseUnavailable } from '@/components/DatabaseUnavailable'
import { isDatabaseError } from '@/lib/database-error'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function FrontendError({ error, reset }: Props) {
  if (isDatabaseError(error)) {
    return (
      <DatabaseUnavailable
        detail={error.message}
        productionPlatform={false}
        onRetry={reset}
      />
    )
  }

  return (
    <DatabaseUnavailable
      title="Something went wrong"
      detail={error.message || 'An unexpected error occurred.'}
      onRetry={reset}
    />
  )
}
