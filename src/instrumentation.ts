export async function register() {
  // Prefer IPv4 so Vercel serverless can reach Supabase / Neon hosts reliably
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('node:dns')
    dns.setDefaultResultOrder('ipv4first')

    // Warm / log DB health on cold start (non-blocking). Failures surface via UI + /api/health/db.
    if (process.env.VERCEL || process.env.NETLIFY) {
      void import('./lib/database-health')
        .then(({ getDatabaseHealth }) => getDatabaseHealth({ force: true }))
        .then((health) => {
          if (health.ok) {
            console.info(
              `[db-health] ok target=${health.target} host=${health.host} ${health.latencyMs}ms`,
            )
          } else {
            console.error(
              `[db-health] unavailable target=${health.target} host=${health.host}: ${health.error}`,
            )
          }
        })
        .catch((err) => {
          console.error('[db-health] probe failed', err)
        })
    }
  }
}
