import React from 'react'
import type { DashboardWidgetServerProps } from 'payload-theme'
import { adminManifest } from '../../../admin/admin.manifest'

/** Plain-language tips under the theme's collection stat cards. */
export default function BeginnerTipsWidget(_props: DashboardWidgetServerProps) {
  const tips = adminManifest.dashboard.tips

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
        <ol
          style={{
            margin: 0,
            paddingLeft: '1.25rem',
            lineHeight: 1.55,
            fontSize: '0.98rem',
          }}
        >
          {tips.map((tip) => (
            <li key={tip} style={{ marginBottom: '0.45rem' }}>
              {tip}
            </li>
          ))}
        </ol>
      </div>
    </article>
  )
}
