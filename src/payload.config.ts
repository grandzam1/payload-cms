import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { cloudinaryStorage } from 'payload-cloudinary'
import { payloadTheme } from 'payload-theme'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { collections } from './collections'
import { SiteSettings } from './globals/SiteSettings'
import { adminManifest } from './admin/admin.manifest'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const rawDatabaseUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || ''
const usePostgres = rawDatabaseUrl.startsWith('postgres')

/** Normalize Neon / Postgres URLs for node-postgres (local + Vercel). */
function resolvePostgresUrl(url: string): string {
  if (!url.startsWith('postgres')) return url
  try {
    const u = new URL(url)
    // node-pg does not support Neon's channel_binding=require
    u.searchParams.delete('channel_binding')
    // Prefer direct Neon compute host — pooled host timeouts when pooler_enabled is false
    if (u.hostname.endsWith('.neon.tech') && u.hostname.includes('-pooler')) {
      u.hostname = u.hostname.replace('-pooler', '')
    }
    // pg maps sslmode=require → verify-full unless uselibpqcompat is set
    u.searchParams.set('sslmode', 'require')
    u.searchParams.set('uselibpqcompat', 'true')
    // Supabase transaction pooler only
    if (u.port === '6543' && !u.searchParams.has('pgbouncer')) {
      u.searchParams.set('pgbouncer', 'true')
    }
    return u.toString()
  } catch {
    return url
  }
}

const databaseUrl = usePostgres ? resolvePostgresUrl(rawDatabaseUrl) : rawDatabaseUrl

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
)

const s3Configured = Boolean(
  !cloudinaryConfigured &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_ENDPOINT,
)

const s3PublicBase =
  process.env.S3_PUBLIC_URL ||
  (process.env.S3_BUCKET
    ? `https://crjnpllyjxujnxdxkjfo.supabase.co/storage/v1/object/public/${process.env.S3_BUCKET}`
    : '')

export default buildConfig({
  admin: {
    user: adminManifest.collections.users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: adminManifest.brand.titleSuffix,
      description: adminManifest.brand.tagline,
    },
    dateFormat: 'MMMM d, yyyy',
    toast: {
      duration: 6000,
      position: 'bottom-center',
    },
    // Nav, dashboard, and login chrome come from payload-theme (below).
    // Keep graphics as a lightweight brand mark for tabs / fallbacks.
    components: {
      graphics: {
        Icon: '/components/admin/graphics/Icon',
        Logo: '/components/admin/graphics/Logo',
      },
    },
  },
  collections,
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usePostgres
    ? process.env.VERCEL
      ? // Vercel → Neon: WebSocket serverless driver (TCP node-pg times out on Vercel)
        vercelPostgresAdapter({
          pool: {
            connectionString: databaseUrl,
            max: 1,
          },
          push: false,
          transactionOptions: false,
          migrationDir: path.resolve(dirname, 'migrations'),
          prodMigrations: migrations,
        })
      : postgresAdapter({
          pool: {
            connectionString: databaseUrl,
            max: 5,
            connectionTimeoutMillis: 30000,
            // Neon TLS — avoid self-signed / chain failures
            ssl: { rejectUnauthorized: false },
          },
          // Schema is managed via migrations — push hangs on interactive prompts / pooler
          push: false,
          // PgBouncer/Supavisor: avoid long-lived transactions that hang on poolers
          transactionOptions: false,
          migrationDir: path.resolve(dirname, 'migrations'),
          prodMigrations: migrations,
        })
    : sqliteAdapter({
        client: {
          url: databaseUrl || 'file:./.db',
        },
        // Dev schema push can hang on interactive prompts under Next; use migrations instead
        push: false,
        wal: {
          synchronous: 'NORMAL',
        },
        busyTimeout: 5000,
        migrationDir: path.resolve(dirname, 'migrations'),
      }),
  sharp,
  plugins: [
    // Beginner-friendly shadcn-style admin (dashboard, sidebar, login, ⌘K)
    payloadTheme({
      preset: 'ocean',
      radius: 'lg',
      font: 'geist',
      login: {
        heading: adminManifest.brand.name,
        tagline: adminManifest.brand.loginHelp,
      },
      nav: {
        icons: {
          pages: 'file-text',
          posts: 'newspaper',
          categories: 'tags',
          media: 'image',
          users: 'users',
          'site-settings': 'settings',
        },
      },
      dashboard: {
        widgets: [
          {
            component: '/components/admin/BeginnerTipsWidget',
            width: 'full',
          },
        ],
      },
    }),
    cloudinaryStorage({
      enabled: cloudinaryConfigured,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
      },
      collections: {
        media: true,
      },
      folder: process.env.CLOUDINARY_FOLDER || 'payload-media',
    }),
    s3Storage({
      enabled: s3Configured,
      collections: {
        media: {
          // Public bucket URLs — skip Payload file proxy for faster delivery
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = [prefix, filename].filter(Boolean).join('/')
            return `${s3PublicBase}/${key}`
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      // Direct browser uploads avoid Vercel’s ~4.5MB serverless body limit
      clientUploads: true,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'eu-central-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
})
