import React from 'react'
import Link from 'next/link'
import type { Payload, TypedUser } from 'payload'
import './welcome-dashboard.scss'

type Props = {
  payload: Payload
  user?: TypedUser | null
}

export default async function WelcomeDashboard({ payload, user }: Props) {
  const [users, media] = await Promise.all([
    payload.count({ collection: 'users' }),
    payload.count({ collection: 'media' }),
  ])

  const displayName =
    (typeof user?.name === 'string' && user.name.trim()) ||
    (typeof user?.email === 'string' && user.email) ||
    'there'

  return (
    <section className="welcome-dashboard" aria-label="Getting started guide">
      <div className="welcome-dashboard__hero">
        <p className="welcome-dashboard__eyebrow">Content studio</p>
        <h1 className="welcome-dashboard__title">Hi {displayName} — here is your starting point</h1>
        <p className="welcome-dashboard__lede">
          This panel is where you manage your website. You do not need any coding. Pick a
          step below, make a change, then tap Save. That is the whole workflow.
        </p>
      </div>

      <div className="welcome-dashboard__stats" aria-label="Quick overview">
        <div className="welcome-dashboard__stat">
          <span className="welcome-dashboard__stat-value">{users.totalDocs}</span>
          <span className="welcome-dashboard__stat-label">Team members</span>
        </div>
        <div className="welcome-dashboard__stat">
          <span className="welcome-dashboard__stat-value">{media.totalDocs}</span>
          <span className="welcome-dashboard__stat-label">Photos &amp; files</span>
        </div>
      </div>

      <div className="welcome-dashboard__steps">
        <Link className="welcome-dashboard__card" href="/admin/collections/media/create">
          <span className="welcome-dashboard__step" aria-hidden="true">
            1
          </span>
          <h2 className="welcome-dashboard__card-title">Add a photo</h2>
          <p className="welcome-dashboard__card-text">
            Upload a picture from your phone or computer. Write a short description so
            everyone knows what it shows.
          </p>
          <span className="welcome-dashboard__card-action">Upload a photo →</span>
        </Link>

        <Link className="welcome-dashboard__card" href="/admin/collections/users">
          <span className="welcome-dashboard__step" aria-hidden="true">
            2
          </span>
          <h2 className="welcome-dashboard__card-title">Invite your team</h2>
          <p className="welcome-dashboard__card-text">
            Add people who should help manage the site. Each person gets their own email
            and password.
          </p>
          <span className="welcome-dashboard__card-action">Manage team →</span>
        </Link>

        <Link className="welcome-dashboard__card" href="/admin/account">
          <span className="welcome-dashboard__step" aria-hidden="true">
            3
          </span>
          <h2 className="welcome-dashboard__card-title">Check your account</h2>
          <p className="welcome-dashboard__card-text">
            Update your name, password, or light/dark theme. Theme changes can make the
            panel easier to read on phones.
          </p>
          <span className="welcome-dashboard__card-action">Open my account →</span>
        </Link>
      </div>

      <aside className="welcome-dashboard__tips">
        <h2 className="welcome-dashboard__tips-title">Friendly tips</h2>
        <ul className="welcome-dashboard__tips-list">
          <li>
            On a phone, open the menu (☰) at the top left to move between Team Members and
            Photos &amp; Files.
          </li>
          <li>
            Always tap <strong>Save</strong> after editing. If you leave without saving,
            your changes will not keep.
          </li>
          <li>
            Not sure what a field means? Look for the small grey help text under each
            label — it explains what to type.
          </li>
          <li>
            Need to undo a mistake? Open the item again and edit it. Nothing here is
            permanent until you save.
          </li>
        </ul>
      </aside>
    </section>
  )
}
