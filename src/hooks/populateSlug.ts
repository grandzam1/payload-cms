import type { CollectionBeforeValidateHook } from 'payload'
import { formatSlug } from '../lib/formatSlug'

/**
 * If the URL slug is empty, fill it from the title so Live Preview can unlock.
 * Never overwrite a slug the editor already typed.
 */
export const populateSlug: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (!data) return data

  const rawSlug = typeof data.slug === 'string' ? data.slug.trim() : ''
  if (rawSlug) {
    data.slug = formatSlug(rawSlug)
    return data
  }

  const title = typeof data.title === 'string' ? data.title.trim() : ''
  if (title) {
    data.slug = formatSlug(title)
  } else if (operation === 'create') {
    // Leave empty so required-field validation can show a clear message.
    data.slug = ''
  }

  return data
}
