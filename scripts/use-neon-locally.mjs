/**
 * @deprecated Use: pnpm db:use:neon
 */
import { spawnSync } from 'node:child_process'

const result = spawnSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['db:use:neon'],
  { stdio: 'inherit', shell: true },
)
process.exit(result.status ?? 1)
