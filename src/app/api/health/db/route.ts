import { NextResponse } from 'next/server'

import { getDatabaseHealth } from '@/lib/database-health'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const force = searchParams.get('fresh') === '1' || searchParams.get('db-check') === '1'
  const health = await getDatabaseHealth({ force })

  return NextResponse.json(
    {
      status: health.ok ? 'ok' : 'unavailable',
      ...health,
    },
    {
      status: health.ok ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
