'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/salaries'
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  async function goToCheckout() {
    setCheckoutLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    const data = await res.json()
    if (data.url) { window.location.href = data.url } else { setCheckoutLoading(false) }
  }
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(
    errorParam === 'expired-token' ? 'Your verification link has expired. Please request a new one.' :
    errorParam === 'invalid-token' ? 'Invalid verification link.' :
    errorParam === 'server-error' ? 'Something went wrong. Please try again.' : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Login failed.')
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1.25rem',
      background: 'linear-gradient(160deg, #f0f5fa 0%, #e4edf5 100%)',
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #d0dde8', boxShadow: '0 8px 40px rgba(30,95,142,0.10)',
        padding: 'clamp(2rem,5vw,3rem)', maxWidth: '420px', width: '100%',
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>
          Welcome back
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Sign in to your PediatricianSalary.com account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#1a2332', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a2332' }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: '0.82rem', color: '#1e5f8e', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9aa5b0', fontSize: '0.85rem', fontWeight: 500,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading}
            style={{ width: '100%', opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#5a6a7a', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span>Not a member yet?</span>
          <Link href="/submit" style={{ color: '#8C1A4A', fontWeight: 700, textDecoration: 'none' }}>
            Submit your salary
          </Link>
          <button onClick={goToCheckout} disabled={checkoutLoading} style={{ background: 'none', border: 'none', color: '#B8860B', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>
            {checkoutLoading ? 'Redirecting…' : 'Get full access'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
