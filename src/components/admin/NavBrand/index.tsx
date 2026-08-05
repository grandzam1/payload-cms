import React from 'react'
import { adminManifest } from '../../../admin/admin.manifest'
import './nav-brand.scss'

/** Injected above nav links — Filament-style product mark */
export default function NavBrand() {
  return (
    <div className="nav-brand" aria-label={adminManifest.brand.name}>
      <span className="nav-brand__mark" aria-hidden="true">
        {adminManifest.brand.shortName.slice(0, 1)}
      </span>
      <div className="nav-brand__text">
        <span className="nav-brand__name">{adminManifest.brand.name}</span>
        <span className="nav-brand__tagline">{adminManifest.brand.tagline}</span>
      </div>
    </div>
  )
}
