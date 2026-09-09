import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
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
import { applyDatabaseEnv, isHostedPlatform } from './lib/database-env'
import { getPreviewPath, getServerSideURL } from './lib/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dbEnv = applyDatabaseEnv(path.resolve(dirname, '..'))
const databaseUrl = dbEnv.databaseUrlUnpooled || dbEnv.databaseUrl
const hosted = isHostedPlatform()
const useVercelPostgres = Boolean(process.env.VERCEL) || dbEnv.isNeon
const serverURL = getServerSideURL()

/** Local HTML labs / alternate localhost hosts (open access only matters on local DB). */
const localCors = dbEnv.isLocal
  ? [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:8765',
      'http://localhost:8765',
      'http://127.0.0.1:5174',
      'http://localhost:5174',
    ]
  : []

const corsOrigins = Array.from(new Set([serverURL, ...localCors].filter(Boolean)))

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
  serverURL,
  cors: corsOrigins,
  csrf: corsOrigins,
  folders: {
    browseByFolder: true,
  },
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
    // LoginHelp shows + autofills the intentional demo credentials.
    components: {
      beforeLogin: ['/components/admin/LoginHelp'],
      graphics: {
        Icon: '/components/admin/graphics/Icon',
        Logo: '/components/admin/graphics/Logo',
      },
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      collections: ['pages', 'posts'],
      url: ({ data, collectionConfig }) => {
        const slug = typeof data?.slug === 'string' ? data.slug.trim() : ''
        if (!slug) return null

        const collection =
          collectionConfig?.slug === 'posts' ? 'posts' : 'pages'
        const path = getPreviewPath({ collection, slug })
        if (!path) return null

        const params = new URLSearchParams({
          path,
          collection,
          slug,
          previewSecret: process.env.PREVIEW_SECRET || '',
        })
        return `${serverURL}/next/preview?${params.toString()}`
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
  db: useVercelPostgres
    ? // Vercel / Neon serverless: WebSocket driver (TCP node-pg times out on Vercel)
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
    : // Local + non-Neon hosts: node-pg. Hosted Netlify with Neon uses the branch above.
      postgresAdapter({
        pool: {
          connectionString: databaseUrl,
          max: hosted ? 1 : 5,
          connectionTimeoutMillis: 30000,
          ssl: dbEnv.isLocal ? false : { rejectUnauthorized: false },
        },
        // Schema is managed via migrations — push hangs on interactive prompts / pooler
        push: false,
        // PgBouncer/Supavisor: avoid long-lived transactions that hang on poolers
        transactionOptions: false,
        migrationDir: path.resolve(dirname, 'migrations'),
        prodMigrations: migrations,
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
        tagline: `Demo: ${adminManifest.brand.demoLogin.email} / ${adminManifest.brand.demoLogin.password}`,
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
