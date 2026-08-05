import React from 'react'
import { adminManifest } from '../../../admin/admin.manifest'

export default function AdminIcon() {
  return (
    <span
      style={{
        display: 'inline-flex',
        width: '1.35rem',
        height: '1.35rem',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        background: 'var(--theme-success-500, #16a34a)',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}
      aria-label={adminManifest.brand.shortName}
    >
      {adminManifest.brand.shortName.slice(0, 1)}
    </span>
  )
}
