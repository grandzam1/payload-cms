/**
 * One-off seed: fetch SpaceX home JSON and map into Payload pages + site-settings marquee.
 *
 * Usage: pnpm exec tsx scripts/seed-home.ts
 */
import { createWriteStream } from 'node:fs'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { applyDatabaseEnv } from '../src/lib/database-env'

applyDatabaseEnv()

const SOURCE_URL =
  process.env.SEED_HOME_URL ||
  'https://spacex.starstruckinfo.net/api/page?username=spacex&slug=home'
const SOURCE_ORIGIN = new URL(SOURCE_URL).origin
const PAGE_SLUG = 'home'

type TextSpan = { text: string; bold?: boolean }

type SourceBlock =
  | {
      id: string
      type: 'callout'
      logo?: { src: string; alt: string }
      paragraphs?: TextSpan[][]
      credit?: { image: string; text: string }
    }
  | {
      id: string
      type: 'heading'
      level?: number
      text: string
    }
  | {
      id: string
      type: 'bullets'
      items: { lead?: string; text: string }[]
    }
  | { id: string; type: 'spacer' }
  | {
      id: string
      type: 'pricing'
      items: {
        title: string
        price?: string
        description: string
        icon?: string
        eyebrow?: string
        cta?: string
      }[]
    }
  | {
      id: string
      type: 'reviews'
      items: {
        avatar: string
        stars: string
        quote: string
        attribution: string
      }[]
    }
  | {
      id: string
      type: 'access_tier'
      title: string
      audience: string
      included: string[]
      image: string
      imageAlt: string
      headingLevel?: 1 | 2
    }
  | {
      id: string
      type: 'image_text'
    }

type SourcePage = {
  cover?: string
  icon?: string
  theme?: 'notion' | 'v2'
  title?: { src: string; alt: string }
  displayName?: string
  marquee?: {
    duration?: number
    logoSize?: number
    direction?: 'rtl' | 'ltr'
    isPlaying?: boolean
    includedCompanies?: string[]
  }
  blocks?: SourceBlock[]
}

function absoluteUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src
  return new URL(src, SOURCE_ORIGIN).toString()
}

function guessMime(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase()
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    case '.pdf':
      return 'application/pdf'
    default:
      return 'application/octet-stream'
  }
}

function lexicalFromParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'text',
              text,
              format: 0,
              mode: 'normal',
              style: '',
              detail: 0,
              version: 1,
            },
          ],
        })),
    },
  }
}

function spansToPlain(paragraphs?: TextSpan[][]): string[] {
  if (!paragraphs?.length) return []
  return paragraphs.map((spans) =>
    spans
      .map((span) => span.text)
      .join('')
      .replace(/\s+\n/g, '\n')
      .trim(),
  )
}

async function downloadToFile(url: string, destPath: string) {
  const res = await fetch(url)
  if (!res.ok || !res.body) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`)
  }
  await mkdir(path.dirname(destPath), { recursive: true })
  await pipeline(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), createWriteStream(destPath))
}

async function main() {
  console.log(`[seed-home] fetching ${SOURCE_URL}`)
  const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
  const source = (await res.json()) as SourcePage

  const cacheDir = await mkdtemp(path.join(tmpdir(), 'seed-home-'))
  await writeFile(path.join(cacheDir, 'source.json'), JSON.stringify(source, null, 2))

  const payload = await getPayload({ config })

  const mediaCache = new Map<string, number>()

  async function ensureMedia(src: string | undefined | null, alt = ''): Promise<number | undefined> {
    if (!src) return undefined
    const cached = mediaCache.get(src)
    if (cached) return cached

    const url = absoluteUrl(src)
    const fileName = path.basename(new URL(url).pathname) || 'asset.bin'
    const destPath = path.join(cacheDir, fileName)

    console.log(`[seed-home] upload media ${src}`)
    await downloadToFile(url, destPath)

    const created = await payload.create({
      collection: 'media',
      data: { alt: alt || fileName },
      filePath: destPath,
      overrideAccess: true,
    })

    mediaCache.set(src, created.id)
    return created.id
  }

  // Collect image refs we need for mapped blocks + page chrome
  const imageJobs: { src: string; alt: string }[] = []
  if (source.cover) imageJobs.push({ src: source.cover, alt: 'Cover' })
  if (source.icon) imageJobs.push({ src: source.icon, alt: 'Icon' })
  if (source.title?.src) imageJobs.push({ src: source.title.src, alt: source.title.alt || 'Title' })

  for (const block of source.blocks || []) {
    if (block.type === 'access_tier') {
      imageJobs.push({ src: block.image, alt: block.imageAlt || block.title })
    }
    if (block.type === 'reviews') {
      for (const item of block.items) {
        if (item.avatar) imageJobs.push({ src: item.avatar, alt: item.attribution })
      }
    }
  }

  for (const job of imageJobs) {
    await ensureMedia(job.src, job.alt)
  }

  const blocks: Record<string, unknown>[] = []

  for (const block of source.blocks || []) {
    switch (block.type) {
      case 'callout': {
        const paragraphs = spansToPlain(block.paragraphs)
        if (!paragraphs.length && block.credit?.text) {
          paragraphs.push(block.credit.text)
        }
        if (!paragraphs.length) break
        blocks.push({
          blockType: 'callout',
          blockName: block.id,
          content: lexicalFromParagraphs(paragraphs),
        })
        break
      }
      case 'heading': {
        blocks.push({
          blockType: 'heading',
          blockName: block.id,
          text: block.text,
        })
        break
      }
      case 'bullets': {
        const items = (block.items || [])
          .map((item) => {
            const text = [item.lead, item.text].filter(Boolean).join(' ').trim()
            return text ? { text } : null
          })
          .filter(Boolean)
        if (!items.length) break
        blocks.push({
          blockType: 'bullets',
          blockName: block.id,
          items,
        })
        break
      }
      case 'spacer': {
        blocks.push({
          blockType: 'spacer',
          blockName: block.id,
          size: 'medium',
        })
        break
      }
      case 'pricing': {
        // Our Pricing block is one card; expand each source item into its own block.
        for (const [index, item] of (block.items || []).entries()) {
          blocks.push({
            blockType: 'pricing',
            blockName: `${block.id}-${index + 1}`,
            title: item.title,
            price: item.price || undefined,
            description: item.description,
          })
        }
        break
      }
      case 'reviews': {
        if (!block.items?.length) break
        blocks.push({
          blockType: 'reviews',
          blockName: block.id,
          items: await Promise.all(
            block.items.map(async (item) => ({
              avatar: await ensureMedia(item.avatar, item.attribution),
              stars: item.stars || '★★★★★',
              quote: item.quote,
              attribution: item.attribution,
            })),
          ),
        })
        break
      }
      case 'access_tier': {
        const imageId = await ensureMedia(block.image, block.imageAlt || block.title)
        if (!imageId) break
        blocks.push({
          blockType: 'access_tier',
          blockName: block.id,
          title: block.title,
          audience: block.audience,
          included: block.included,
          image: imageId,
          imageAlt: block.imageAlt?.trim() || block.title,
          headingLevel: block.headingLevel,
        })
        break
      }
      default:
        console.log(`[seed-home] skip unsupported block type=${block.type} id=${block.id}`)
    }
  }

  const pageData = {
    title: source.displayName || source.title?.alt || 'SpaceX',
    slug: PAGE_SLUG,
    theme: source.theme === 'notion' ? 'notion' : 'v2',
    cover: await ensureMedia(source.cover, 'Cover'),
    icon: await ensureMedia(source.icon, 'Icon'),
    titleImage: await ensureMedia(source.title?.src, source.title?.alt || 'Title'),
    blocks,
    _status: 'published' as const,
  }

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: PAGE_SLUG } },
    limit: 1,
    overrideAccess: true,
  })

  let pageId: number | string
  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: pageData,
      overrideAccess: true,
      draft: false,
    })
    pageId = updated.id
    console.log(`[seed-home] updated page id=${pageId} slug=${PAGE_SLUG}`)
  } else {
    const created = await payload.create({
      collection: 'pages',
      data: pageData,
      overrideAccess: true,
      draft: false,
    })
    pageId = created.id
    console.log(`[seed-home] created page id=${pageId} slug=${PAGE_SLUG}`)
  }

  if (source.marquee) {
    const companyIds = new Set(['neuralink', 'grok', 'spacex', 'tesla', 'boring', 'x'])
    const includedCompanies = (source.marquee.includedCompanies || []).filter((id) =>
      companyIds.has(id),
    ) as ('neuralink' | 'grok' | 'spacex' | 'tesla' | 'boring' | 'x')[]

    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: source.displayName || 'SpaceX',
        tagline: source.title?.alt || 'SpaceX',
        marquee: {
          duration: source.marquee.duration ?? 40,
          logoSize: source.marquee.logoSize ?? 48,
          direction: source.marquee.direction === 'ltr' ? 'ltr' : 'rtl',
          isPlaying: source.marquee.isPlaying !== false,
          includedCompanies:
            includedCompanies.length > 0
              ? includedCompanies
              : ['neuralink', 'grok', 'spacex', 'tesla', 'boring', 'x'],
        },
      },
      overrideAccess: true,
    })
    console.log('[seed-home] updated site-settings marquee')
  }

  const verify = await payload.findByID({
    collection: 'pages',
    id: pageId,
    depth: 0,
    overrideAccess: true,
  })

  console.log(
    JSON.stringify(
      {
        ok: true,
        pageId: verify.id,
        slug: verify.slug,
        title: verify.title,
        theme: verify.theme,
        blockCount: Array.isArray(verify.blocks) ? verify.blocks.length : 0,
        blockTypes: Array.isArray(verify.blocks)
          ? verify.blocks.map((b) => (b && typeof b === 'object' && 'blockType' in b ? b.blockType : '?'))
          : [],
        mediaUploaded: mediaCache.size,
        adminPath: `/admin/collections/pages/${pageId}`,
      },
      null,
      2,
    ),
  )

  process.exit(0)
}

main().catch((error) => {
  console.error('[seed-home] failed', error)
  process.exit(1)
})
