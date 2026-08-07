/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* Health gate added: show friendly UI when Neon/Postgres is unreachable. */
import type { Metadata } from 'next'
import React from 'react'

import { DatabaseUnavailable } from '@/components/DatabaseUnavailable'
import { getDatabaseHealth } from '@/lib/database-health'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  const query = await searchParams
  const force = query['db-check'] === '1'
  const health = await getDatabaseHealth({ force })

  if (!health.ok) {
    return (
      <DatabaseUnavailable
        detail={health.error}
        host={health.host}
        productionPlatform={health.productionPlatform}
      />
    )
  }

  return RootPage({ config, params, searchParams, importMap })
}

export default Page
