import React from 'react'

import './database-unavailable.scss'

type Props = {
  title?: string
  detail?: string
  host?: string
  productionPlatform?: boolean
  /** Client-only retry (error.tsx). Omit on server pages that use a link refresh. */
  onRetry?: () => void
}

export function DatabaseUnavailable({
  title = 'Database unavailable',
  detail,
  host,
  productionPlatform = false,
  onRetry,
}: Props) {
  const message =
    detail ||
    (productionPlatform
      ? 'This deployment cannot reach Neon Postgres. Content and admin stay offline until the connection is restored.'
      : 'Postgres is not reachable right now. Start the database or check DATABASE_URL, then try again.')

  return (
    <div className="db-unavailable" role="alert" aria-live="polite">
      <div className="db-unavailable__panel">
        <p className="db-unavailable__eyebrow">Connection</p>
        <h1 className="db-unavailable__title">{title}</h1>
        <p className="db-unavailable__body">{message}</p>

        <dl className="db-unavailable__meta">
          {host ? (
            <>
              <dt>Host</dt>
              <dd>
                <code>{host}</code>
              </dd>
            </>
          ) : null}
          <dt>Mode</dt>
          <dd>{productionPlatform ? 'Production (Neon required)' : 'Local / development'}</dd>
        </dl>

        <div className="db-unavailable__actions">
          {onRetry ? (
            <button className="db-unavailable__btn" type="button" onClick={onRetry}>
              Try again
            </button>
          ) : (
            <a className="db-unavailable__btn" href="?db-check=1">
              Try again
            </a>
          )}
          <a className="db-unavailable__link" href="/api/health/db">
            Health JSON
          </a>
        </div>

        {productionPlatform ? (
          <p className="db-unavailable__hint">
            Confirm <code>DATABASE_URL</code> and <code>DATABASE_URL_UNPOOLED</code> in the
            Vercel/Netlify project env, then redeploy if needed.
          </p>
        ) : (
          <p className="db-unavailable__hint">
            Local tip: <code>pnpm db:status</code> · switch with <code>pnpm db:use:local</code> or{' '}
            <code>pnpm db:use:neon</code>
          </p>
        )}
      </div>
    </div>
  )
}
