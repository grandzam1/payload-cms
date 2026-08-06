import { spawnSync } from 'node:child_process'
import { applyDatabaseEnv, maskDatabaseUrl } from '../src/lib/database-env'

const config = applyDatabaseEnv()
const host = (() => {
  try {
    return new URL(config.databaseUrl).host
  } catch {
    return 'unknown'
  }
})()

console.log(
  `[db] target=${config.target} host=${host} url=${maskDatabaseUrl(config.databaseUrl)}`,
)

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: pnpm db:run -- <payload-command> [args...]')
  process.exit(1)
}

const result = spawnSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['exec', 'payload', ...args],
  {
    env: process.env,
    stdio: 'inherit',
    shell: true,
  },
)

process.exit(result.status ?? 1)
