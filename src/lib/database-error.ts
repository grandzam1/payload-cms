/** Client-safe helpers — no Node / pg imports. */

export function isDatabaseError(error: unknown): boolean {
  const text = [
    error instanceof Error ? error.message : String(error ?? ''),
    error instanceof Error ? error.name : '',
    error && typeof error === 'object' && 'code' in error
      ? String((error as { code?: unknown }).code ?? '')
      : '',
  ]
    .join(' ')
    .toLowerCase()

  const needles = [
    'econnrefused',
    'enotfound',
    'etimedout',
    'econnreset',
    'connection terminated',
    'connection timeout',
    'connect etimedout',
    'timeout exceeded',
    'could not connect',
    'cannot connect',
    'failed to connect',
    'database',
    'postgres',
    'neon',
    'password authentication failed',
    'too many connections',
    'ssl',
    'getaddrinfo',
    'no database url',
    'database_url',
    'missing connection',
    'database unavailable',
  ]

  return needles.some((n) => text.includes(n))
}
