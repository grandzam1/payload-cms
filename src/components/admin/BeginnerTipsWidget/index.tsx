import React from 'react'
import type { DashboardWidgetServerProps } from 'payload-theme'

/** Plain-language tips under the theme's collection stat cards. */
export default function BeginnerTipsWidget(_props: DashboardWidgetServerProps) {
  return (
    <article
      className="pt-dash__card"
      style={{ gridColumn: '1 / -1' }}
      aria-label="Getting started tips"
    >
      <div className="pt-dash__card-head">
        <span className="pt-dash__card-label">New here? Start with these</span>
      </div>
      <div className="pt-dash__card-body">
        <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.55 }}>
          <li>
            Open <strong>Pages</strong> to edit Home / About style pages, or <strong>Posts</strong>{' '}
            for articles.
          </li>
          <li>
            Upload pictures in <strong>Media</strong>. Always fill in the short description under
            the file.
          </li>
          <li>
            Use <strong>Categories</strong> to group posts. Open <strong>Site Settings</strong> for
            site-wide options.
          </li>
          <li>
            Tap <strong>Save</strong> after every change. Press <strong>Ctrl+K</strong> (⌘K on Mac)
            to search or jump anywhere.
          </li>
        </ol>
      </div>
    </article>
  )
}
