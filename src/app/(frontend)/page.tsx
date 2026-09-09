import { headers as getHeaders } from 'next/headers.js'
import { draftMode } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import { ContentView } from '@/components/ContentView'
import { DatabaseUnavailable } from '@/components/DatabaseUnavailable'
import { getDocumentBySlug } from '@/lib/getDocument'
import { getDatabaseHealth } from '@/lib/database-health'
import config from '@/payload.config'
import './styles.css'

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = searchParams ? await searchParams : {}
  const force = params['db-check'] === '1'
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

  const homePage = await getDocumentBySlug('pages', 'home')
  if (homePage) {
    const { isEnabled } = await draftMode()
    return <ContentView doc={homePage} showPreviewListener={isEnabled} />
  }

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && <h1>Welcome to your new project.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
        <p className="hint">
          Or create a Page with slug <code>home</code> to replace this screen.
        </p>
      </div>
    </div>
  )
}
