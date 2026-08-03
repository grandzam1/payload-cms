export async function register() {
  // Prefer IPv4 so Vercel serverless can reach Supabase pooler hosts reliably
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('node:dns')
    dns.setDefaultResultOrder('ipv4first')
  }
}
