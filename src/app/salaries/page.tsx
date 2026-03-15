'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SalaryCard } from '@/components/SalaryCard'

const STORAGE_KEY = 'peds_access_email'

export default function SalariesPage() {
  const [email, setEmail] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [salaries, setSalaries] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Check if already unlocked
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setAccessGranted(true)
      fetchSalaries()
    }
  }, [])

  async function fetchSalaries() {
    setLoading(true)
    try {
      const res = await fetch('/api/salaries')
      const data = await res.json()
      setSalaries(data.salaries || [])
    } catch {
      // silently fail — empty list shown
    } finally {
      setLoading(false)
    }
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    const normalized = email.toLowerCase().trim()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    if (!valid) { setError('Please enter a valid email address.'); return }

    setSubmitting(true)
    setError('')

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      })
      // Save locally even if already subscribed — just grant access
      localStorage.setItem(STORAGE_KEY, normalized)
      setAccessGranted(true)
      fetchSalaries()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Email gate ────────────────────────────────────────────────────────────
  if (!accessGranted) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        background: 'linear-gradient(160deg, #f0f5fa 0%, #e4edf5 100%)',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #d0dde8',
          boxShadow: '0 8px 40px rgba(30,95,142,0.10)',
          padding: 'clamp(2rem, 5vw, 3rem)',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
        }}>
          {/* Icon */}
          <div style={{
            width: '64px', height: '64px',
            backgroundColor: '#e8f1f8',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.75rem',
          }}>
            📊
          </div>

          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
            fontWeight: 800,
            color: '#1a2332',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
          }}>
            Access the Salary Database
          </h1>

          <p style={{
            color: '#5a6a7a',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '0.5rem',
          }}>
            Enter your email to browse real pediatrician salary data — submitted anonymously by physicians across the US.
          </p>

          <p style={{
            color: '#9aa5b0',
            fontSize: '0.82rem',
            marginBottom: '2rem',
          }}>
            Free. No password. No spam.
          </p>

          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              style={{ textAlign: 'center', fontSize: '1rem' }}
              autoFocus
            />
            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>{error}</p>
            )}
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={submitting}
              style={{ width: '100%', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Unlocking…' : 'View Salaries →'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e8eff6',
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Proof label="100% Anonymous" />
            <Proof label="Physician-Submitted" />
            <Proof label="Free Access" />
          </div>

          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#9aa5b0' }}>
            Want to contribute?{' '}
            <Link href="/submit" style={{ color: '#1e5f8e', fontWeight: 600, textDecoration: 'none' }}>
              Submit your salary
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // ── Salary list ───────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
          Pediatrician Salaries
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '1rem' }}>
          {loading ? 'Loading…' : `${salaries.length} ${salaries.length === 1 ? 'submission' : 'submissions'} from physicians across the US`}
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5a6a7a' }}>Loading salaries…</div>
      )}

      {!loading && salaries.length === 0 && <EmptyState />}

      {!loading && salaries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {salaries.map(s => (
            <SalaryCard key={String(s._id)} s={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function Proof({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: '#5a6a7a', fontWeight: 500 }}>
      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {label}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '5rem 1.25rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #d0dde8',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩺</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a2332', marginBottom: '0.75rem' }}>
        No salaries yet — be the first.
      </h2>
      <p style={{ color: '#5a6a7a', fontSize: '1rem', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
        The database is brand new. Every submission helps build a resource the entire pediatrics community will use.
      </p>
      <Link href="/submit" className="btn btn-primary" style={{ fontSize: '1rem' }}>
        Submit Your Salary
      </Link>
    </div>
  )
}
