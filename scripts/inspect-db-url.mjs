import fs from 'node:fs'

const raw = fs.readFileSync('.env.neon', 'utf8')
const line = raw.split(/\r?\n/).find((l) => l.startsWith('DATABASE_URL='))
if (!line) {
  console.log('DATABASE_URL missing')
  process.exit(1)
}
const value = line.slice('DATABASE_URL='.length)
console.log('len', value.length)
console.log('startsWith', value.slice(0, 12))
console.log('endsWith', value.slice(-20).replace(/./g, (c) => (/[a-zA-Z0-9]/.test(c) ? c : c)))
console.log('quoted', (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
console.log('hasNeon', value.includes('neon.tech'))
console.log('hasPooler', value.includes('-pooler') || value.includes('pooler'))
console.log('hasSupabase', value.includes('supabase'))
try {
  const cleaned = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
  const u = new URL(cleaned)
  console.log('host', u.host)
  console.log('search', u.search)
} catch (e) {
  console.log('urlError', e.message)
  // show non-secret diagnostics
  console.log('atIndex', value.indexOf('@'))
  console.log('protocolPart', value.split('@')[0].split(':')[0])
}
