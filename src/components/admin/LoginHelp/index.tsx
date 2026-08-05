import React from 'react'
import { adminManifest } from '../../../admin/admin.manifest'
import './login-help.scss'

export default function LoginHelp() {
  return (
    <div className="login-help">
      <h1 className="login-help__title">{adminManifest.brand.loginTitle}</h1>
      <p className="login-help__text">{adminManifest.brand.loginHelp}</p>
    </div>
  )
}
