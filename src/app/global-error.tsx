'use client'

import React from 'react'

import { DatabaseUnavailable } from '@/components/DatabaseUnavailable'
import { isDatabaseError } from '@/lib/database-error'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <DatabaseUnavailable
          title={isDatabaseError(error) ? 'Database unavailable' : 'Application error'}
          detail={error.message}
          onRetry={reset}
        />
      </body>
    </html>
  )
}
