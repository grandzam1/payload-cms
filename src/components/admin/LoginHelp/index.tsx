'use client'

import React, { useEffect } from 'react'
import { adminManifest } from '../../../admin/admin.manifest'
import './login-help.scss'

const DEMO = adminManifest.brand.demoLogin

function fillLoginFields() {
  const email =
    document.querySelector<HTMLInputElement>(
      'input[name="email"], input[type="email"], input[autocomplete="email"], input[autocomplete="username"]',
    ) ?? null
  const password =
    document.querySelector<HTMLInputElement>(
      'input[name="password"], input[type="password"], input[autocomplete="current-password"]',
    ) ?? null

  const setValue = (input: HTMLInputElement | null, value: string) => {
    if (!input || input.value) return
    const proto = Object.getPrototypeOf(input)
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value')
    descriptor?.set?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  setValue(email, DEMO.email)
  setValue(password, DEMO.password)
}

export default function LoginHelp() {
  useEffect(() => {
    fillLoginFields()
    const timer = window.setTimeout(fillLoginFields, 250)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="login-help">
      <h1 className="login-help__title">{adminManifest.brand.loginTitle}</h1>
      <p className="login-help__text">{adminManifest.brand.loginHelp}</p>
      <div className="login-help__demo" aria-label="Demo login details">
        <p className="login-help__demo-label">Demo login (already filled in)</p>
        <dl className="login-help__creds">
          <div>
            <dt>Email</dt>
            <dd>
              <code>{DEMO.email}</code>
            </dd>
          </div>
          <div>
            <dt>Password</dt>
            <dd>
              <code>{DEMO.password}</code>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
