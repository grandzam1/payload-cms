import type { Access } from 'payload'

/** Public read access */
export const anyone: Access = () => true

/** Signed-in users only */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
