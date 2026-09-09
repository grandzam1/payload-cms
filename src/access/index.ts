import type { Access } from 'payload'
import { applyDatabaseEnv } from '../lib/database-env'

/**
 * Local Postgres opens collection REST APIs (no JWT).
 * Override with PAYLOAD_OPEN_ACCESS=true|false (do not set true on Vercel).
 */
export function isOpenAccess(): boolean {
  const override = process.env.PAYLOAD_OPEN_ACCESS?.trim().toLowerCase()
  if (override === 'true' || override === '1') return true
  if (override === 'false' || override === '0') return false
  return applyDatabaseEnv().isLocal
}

/** Public read access */
export const anyone: Access = () => true

/** Signed-in users only — open on local (see isOpenAccess) */
export const authenticated: Access = ({ req: { user } }) => {
  if (isOpenAccess()) return true
  return Boolean(user)
}

/**
 * Logged-in users see drafts + published.
 * Public API / frontend only sees published documents.
 * Local open access: full read (including drafts).
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (isOpenAccess() || user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
