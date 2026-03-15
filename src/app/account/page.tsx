'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type User = {
  userId: string
  email: string
  tier: 'none' | 'pro' | 'paid'
  emailVerified: boolean
  createdAt: string
  submissionId: string | null
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) { router.push('/login'); return }
        setUser(d.user)
      })
      .finally(() => setLoading(false))
  }, [router])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a7a' }}>Loading…</div>
  }

  if (!user) return null

  const tierLabel = user.tier === 'pro' ? 'Pro' : user.tier === 'paid' ? 'Paid' : 'No Access'
  const tierColor = user.tier === 'pro' ? '#16a34a' : user.tier === 'paid' ? '#1e5f8e' : '#9aa5b0'
  const tierBg = user.tier === 'pro' ? '#dcfce7' : user.tier === 'paid' ? '#e8f1f8' : '#f0f5fa'

  const hasAccess = user.tier === 'pro' || user.tier === 'paid'

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.25rem 4rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
        My Account
      </h1>
      <p style={{ color: '#5a6a7a', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Manage your PediatricianSalary.com account.
      </p>

      {/* Status card */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d0dde8', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa5b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
          Account
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332' }}>{user.email}</p>
            <p style={{ fontSize: '0.82rem', color: '#9aa5b0', marginTop: '0.2rem' }}>
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span style={{ backgroundColor: tierBg, color: tierColor, fontWeight: 700, fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
            {tierLabel}
          </span>
        </div>
      </div>

      {/* Access status */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d0dde8', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa5b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
          Database Access
        </p>
        {hasAccess ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#16a34a', fontSize: '1.25rem' }}>✓</span>
            <div>
              <p style={{ fontWeight: 600, color: '#1a2332', fontSize: '0.95rem' }}>Full access granted</p>
              <p style={{ fontSize: '0.82rem', color: '#5a6a7a', marginTop: '0.1rem' }}>
                {user.tier === 'pro' ? 'Earned by submitting an approved salary.' : 'Purchased one-time access.'}
              </p>
            </div>
          </div>
        ) : user.submissionId ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>⏳</span>
            <div>
              <p style={{ fontWeight: 600, color: '#1a2332', fontSize: '0.95rem' }}>Submission under review</p>
              <p style={{ fontSize: '0.82rem', color: '#5a6a7a', marginTop: '0.1rem' }}>
                You&apos;ll get full access and an email when your salary is approved.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: '#5a6a7a', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Submit a salary to earn free access, or purchase one-time access.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/submit" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>
                Submit Your Salary
              </Link>
              <Link href="/pricing" className="btn btn-ghost" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>
                View Pricing
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d0dde8', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa5b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
          Security
        </p>
        <Link href="/forgot-password" style={{ color: '#1e5f8e', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
          Change password →
        </Link>
      </div>

      <button
        onClick={logout}
        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem 0' }}
      >
        Sign out
      </button>
    </div>
  )
}
