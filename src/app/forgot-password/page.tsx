'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
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
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
            The link expires in 1 hour.
          </p>
          <p style={{ color: '#9aa5b0', fontSize: '0.82rem', marginTop: '1rem' }}>
            Check your spam folder if you don&apos;t see it.
          </p>
          <Link href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#1e5f8e', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to login
          </Link>
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
          Forgot your password?
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Enter your email and we&apos;ll send you a reset link.
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
              onChange={e => { setEmail(e.target.value); setError('') }}
              autoFocus
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
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#5a6a7a' }}>
          <Link href="/login" style={{ color: '#1e5f8e', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
