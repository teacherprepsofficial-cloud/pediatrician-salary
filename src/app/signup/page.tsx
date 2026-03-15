'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirm) { setError('Please fill in all fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Signup failed.')
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem 1.25rem',
        background: 'linear-gradient(160deg, #f0f5fa 0%, #e4edf5 100%)',
      }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', border: '1px solid #d0dde8',
          boxShadow: '0 8px 40px rgba(30,95,142,0.10)',
          padding: 'clamp(2rem,5vw,3rem)', maxWidth: '420px', width: '100%', textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.75rem' }}>
            Check your email
          </h1>
          <p style={{ color: '#5a6a7a', lineHeight: 1.7, fontSize: '0.95rem' }}>
            We sent a verification link to <strong>{email}</strong>.
            Click the link in that email to activate your account.
          </p>
          <p style={{ color: '#9aa5b0', fontSize: '0.82rem', marginTop: '1rem' }}>
            The link expires in 24 hours. Check your spam folder if you don&apos;t see it.
          </p>
        </div>
      </div>
    )
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
          Create your account
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Free to join. Submit a salary to unlock full access.
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
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#1a2332', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
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

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: '#1a2332', marginBottom: '0.5rem' }}>
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="Repeat your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#5a6a7a', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span>Not a member yet?</span>
          <Link href="/submit" style={{ color: '#8C1A4A', fontWeight: 700, textDecoration: 'none' }}>
            Submit your salary
          </Link>
          <Link href="/pricing" style={{ color: '#B8860B', fontWeight: 700, textDecoration: 'none' }}>
            Get full access
          </Link>
        </div>
      </div>
    </div>
  )
}
