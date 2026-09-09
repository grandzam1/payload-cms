/**
 * Backfill version rows after enabling drafts on existing collections.
 * Run: pnpm exec tsx scripts/backfill-draft-versions.ts
 *
 * Only republishes docs that are already published, so drafts stay drafts.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  for (const collection of ['posts', 'pages'] as const) {
    const result = await payload.find({
      collection,
      limit: 1000,
      pagination: false,
      overrideAccess: true,
      draft: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    console.log(`${collection}: backfilling ${result.docs.length} published docs`)

    for (const doc of result.docs) {
      await payload.update({
        id: doc.id,
        collection,
        data: { _status: 'published' },
        draft: false,
        overrideAccess: true,
      })
      console.log(`  ok ${collection}#${doc.id} slug=${doc.slug}`)
    }
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
