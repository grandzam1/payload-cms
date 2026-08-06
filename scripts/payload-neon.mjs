/**
 * @deprecated Use: pnpm db:migrate (with DB_TARGET=neon) or pnpm db:use:neon && pnpm db:migrate
 */
import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const result = spawnSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['db:migrate', ...args],
  { stdio: 'inherit', shell: true, env: { ...process.env, DB_TARGET: 'neon' } },
)
process.exit(result.status ?? 1)
