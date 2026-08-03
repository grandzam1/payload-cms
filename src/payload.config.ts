import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { cloudinaryStorage } from 'payload-cloudinary'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const rawDatabaseUrl =
  process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || ''
const usePostgres = rawDatabaseUrl.startsWith('postgres')

/** Normalize Neon / pooler URLs for node-postgres on Vercel. */
function resolvePostgresUrl(url: string): string {
  if (!url.startsWith('postgres')) return url
  try {
    const u = new URL(url)
    // node-pg does not support Neon's channel_binding=require
    u.searchParams.delete('channel_binding')
    // pg maps sslmode=require → verify-full unless uselibpqcompat is set
    u.searchParams.set('sslmode', 'require')
    u.searchParams.set('uselibpqcompat', 'true')
    // On Vercel, prefer Neon pooler endpoint when given a direct host
    if (
      process.env.VERCEL &&
      u.hostname.endsWith('.neon.tech') &&
      !u.hostname.includes('-pooler')
    ) {
      u.hostname = u.hostname.replace(/^(ep-[a-z0-9-]+)/i, '$1-pooler')
    }
    // Supabase transaction pooler
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
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Content Studio',
      description: 'A simple place to manage your website content, team, and files.',
    },
    dateFormat: 'MMMM d, yyyy',
    toast: {
      duration: 6000,
      position: 'bottom-center',
    },
    components: {
      beforeDashboard: ['/components/admin/WelcomeDashboard'],
      beforeLogin: ['/components/admin/LoginHelp'],
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUrl,
          // Local: a few connections; Vercel serverless should stay tiny
          max: process.env.VERCEL ? 1 : 5,
          connectionTimeoutMillis: 30000,
          // Neon/Supabase TLS — avoid self-signed / chain failures on serverless
          ssl: { rejectUnauthorized: false },
        },
        // Schema is managed via migrations — push hangs on interactive prompts / pooler
        push: false,
        // PgBouncer/Supavisor: avoid long-lived transactions that hang on poolers
        transactionOptions: false,
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
      }),
  sharp,
  plugins: [
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
