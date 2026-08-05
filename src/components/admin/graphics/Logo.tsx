import React from 'react'
import { adminManifest } from '../../../admin/admin.manifest'

export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
      <span
        style={{
          display: 'inline-flex',
          width: '2rem',
          height: '2rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          background: 'var(--theme-success-500, #16a34a)',
          color: '#fff',
          fontWeight: 700,
        }}
      >
        {adminManifest.brand.shortName.slice(0, 1)}
      </span>
      <span style={{ fontWeight: 650, fontSize: '1.1rem' }}>{adminManifest.brand.name}</span>
    </div>
  )
}
