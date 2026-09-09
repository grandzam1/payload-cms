import { chromium, expect, test } from '@playwright/test'

const base = 'http://127.0.0.1:3000'
const secret = process.env.PREVIEW_SECRET || 'preview-dev-secret-change-me'

test.describe('Live Preview / Draft Mode smoke', () => {
  test('published page is public', async ({ page }) => {
    await page.goto(`${base}/preview-demo`)
    await expect(page.locator('h1')).toContainText('Preview Demo Page')
    await expect(page.locator('body')).toContainText(
      'This published page is visible to everyone.',
    )
  })

  test('draft post is hidden without Draft Mode', async ({ page }) => {
    const res = await page.goto(`${base}/posts/draft-only-post`)
    expect(res?.status()).toBe(404)
  })

  test('preview route enables Draft Mode and shows draft', async ({
    context,
  }) => {
    const page = await context.newPage()
    const previewUrl =
      `${base}/next/preview?` +
      new URLSearchParams({
        path: '/posts/draft-only-post',
        collection: 'posts',
        slug: 'draft-only-post',
        previewSecret: secret,
      }).toString()

    await page.goto(previewUrl)
    await expect(page).toHaveURL(/\/posts\/draft-only-post/)
    await expect(page.locator('h1')).toContainText('Secret Draft Post')
    await expect(page.locator('body')).toContainText(
      'Draft body — not for the public.',
    )
  })

  test('admin login page loads (Live Preview entry exists after auth)', async ({
    page,
  }) => {
    await page.goto(`${base}/admin/login`)
    await expect(page.locator('#field-email')).toBeVisible()
    await expect(page.locator('#field-password')).toBeVisible()
  })
})
