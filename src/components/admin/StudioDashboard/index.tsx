import React from 'react'
import Link from 'next/link'
import type { CollectionSlug, Payload, TypedUser } from 'payload'
import {
  adminManifest,
  collectionListPath,
  dashboardQuickCreates,
  dashboardStatResources,
  globalPath,
} from '../../../admin/admin.manifest'
import './studio-dashboard.scss'

type Props = {
  payload: Payload
  user?: TypedUser | null
}

export default async function StudioDashboard({ payload, user }: Props) {
  const stats = dashboardStatResources()
  const counts = await Promise.all(
    stats.map(async (resource) => ({
      slug: resource.slug,
      plural: resource.plural,
      total: (
        await payload.count({
          collection: resource.slug as CollectionSlug,
        })
      ).totalDocs,
    })),
  )

  const quickCreates = dashboardQuickCreates()
  const displayName =
    (typeof user?.name === 'string' && user.name.trim()) ||
    (typeof user?.email === 'string' && user.email) ||
    'there'

  const settings = adminManifest.globals.siteSettings

  return (
    <section className="studio-dashboard" aria-label="Studio dashboard">
      <header className="studio-dashboard__header">
        <p className="studio-dashboard__eyebrow">{adminManifest.dashboard.eyebrow}</p>
        <h1 className="studio-dashboard__title">
          {adminManifest.dashboard.title}
          <span className="studio-dashboard__user"> · {displayName}</span>
        </h1>
        <p className="studio-dashboard__lede">{adminManifest.dashboard.lede}</p>
      </header>

      <div className="studio-dashboard__stats" aria-label="Resource counts">
        {counts.map((item) => (
          <Link
            key={item.slug}
            className="studio-dashboard__stat"
            href={collectionListPath(item.slug)}
          >
            <span className="studio-dashboard__stat-value">{item.total}</span>
            <span className="studio-dashboard__stat-label">{item.plural}</span>
          </Link>
        ))}
      </div>

      <div className="studio-dashboard__grid">
        <section className="studio-dashboard__panel" aria-label="Quick actions">
          <h2 className="studio-dashboard__panel-title">Quick actions</h2>
          <ul className="studio-dashboard__actions">
            {quickCreates.map((action) => (
              <li key={action.href}>
                <Link className="studio-dashboard__action" href={action.href}>
                  <span className="studio-dashboard__action-label">{action.label}</span>
                  <span className="studio-dashboard__action-desc">{action.description}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link className="studio-dashboard__action" href={globalPath(settings.slug)}>
                <span className="studio-dashboard__action-label">Open site settings</span>
                <span className="studio-dashboard__action-desc">{settings.description}</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="studio-dashboard__panel" aria-label="Sidebar guide">
          <h2 className="studio-dashboard__panel-title">Sidebar</h2>
          <ul className="studio-dashboard__groups">
            {adminManifest.navGroups.map((group) => (
              <li key={group.id} className="studio-dashboard__group">
                <strong>{group.label}</strong>
                <span>
                  {group.id === 'content' && 'Pages, Posts, Categories'}
                  {group.id === 'media' && 'Uploads and reusable files'}
                  {group.id === 'system' && 'Users and site settings'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}
