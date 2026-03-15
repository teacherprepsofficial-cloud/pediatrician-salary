'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type User = { email: string; tier: 'none' | 'pro' | 'paid'; paidUntil?: string } | null

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User>(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      setUser(d.user || null)
      setUserLoaded(true)
    })
  }, [])

  async function handleBuy() {
    if (!userLoaded) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return }
    window.location.href = data.url
  }

  const hasAccess = user && (user.tier === 'pro' || user.tier === 'paid')

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Access the Salary Database
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
          Real salary data submitted anonymously by pediatricians across the US.
          Three ways to get in.
        </p>
      </div>

      {/* Pricing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

        {/* 1. Log In */}
        <div style={{ backgroundColor: 'white', border: '2px solid #1e5f8e', borderRadius: '16px', padding: '2rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1e5f8e', color: 'white', fontWeight: 700, fontSize: '0.72rem', padding: '0.3rem 1rem', borderRadius: '9999px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            Welcome back!
          </div>
          <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', lineHeight: 1, marginBottom: '0.4rem' }}>Log In</div>
            <p style={{ color: '#5a6a7a', fontSize: '0.875rem' }}>Access with your existing account</p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem', flexGrow: 1 }}>
            {['Full database access', 'Browse all salary submissions', 'Filter by specialty, state, career stage'].map(item => (
              <li key={item} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                <span style={{ color: '#1e5f8e', fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
              </li>
            ))}
          </ul>
          {hasAccess ? (
            <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>✓ You&apos;re logged in</div>
          ) : (
            <Link href="/login?redirect=/salaries" className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              Log In
            </Link>
          )}
        </div>

        {/* 2. Submit Salary */}
        <div style={{ backgroundColor: 'white', border: '2px solid #16a34a', borderRadius: '16px', padding: '2rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#16a34a', color: 'white', fontWeight: 700, fontSize: '0.72rem', padding: '0.3rem 1rem', borderRadius: '9999px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            For existing pediatricians
          </div>
          <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', lineHeight: 1, marginBottom: '0.4rem' }}>Free</div>
            <p style={{ color: '#5a6a7a', fontSize: '0.875rem' }}>Submit an approved salary</p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem', flexGrow: 1 }}>
            {['Full database access — permanent', 'Browse all salary submissions', 'Filter by specialty, state, career stage', 'Contribute to salary transparency'].map(item => (
              <li key={item} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
              </li>
            ))}
          </ul>
          {hasAccess && user?.tier === 'pro' ? (
            <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>✓ You have Pro access</div>
          ) : (
            <Link href="/submit" className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', borderColor: '#16a34a', color: '#16a34a' }}>
              Submit Your Salary
            </Link>
          )}
        </div>

        {/* 3. Buy Access */}
        <div style={{ backgroundColor: 'white', border: '2px solid #8C1A4A', borderRadius: '16px', padding: '2rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#8C1A4A', color: 'white', fontWeight: 700, fontSize: '0.72rem', padding: '0.3rem 1rem', borderRadius: '9999px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            For future pediatricians
          </div>
          <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', lineHeight: 1 }}>$100</span>
              <span style={{ color: '#5a6a7a', fontSize: '0.875rem', marginBottom: '0.2rem' }}>one-time</span>
            </div>
            <p style={{ color: '#5a6a7a', fontSize: '0.875rem', marginTop: '0.4rem' }}>12 months access, then expires</p>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem', flexGrow: 1 }}>
            {['Full database access for 1 year', 'Browse all salary submissions', 'Filter by specialty, state, career stage', 'Access expires after 12 months'].map(item => (
              <li key={item} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
              </li>
            ))}
          </ul>
          {hasAccess && user?.tier === 'paid' ? (
            <div style={{ textAlign: 'center', color: '#8C1A4A', fontWeight: 700, fontSize: '0.9rem' }}>✓ You have Paid access</div>
          ) : hasAccess ? (
            <div style={{ textAlign: 'center', color: '#9aa5b0', fontSize: '0.875rem' }}>You already have access</div>
          ) : (
            <>
              <button onClick={handleBuy} disabled={loading || !userLoaded} className="btn btn-primary" style={{ width: '100%', opacity: (loading || !userLoaded) ? 0.7 : 1 }}>
                {loading ? 'Redirecting to checkout…' : 'Buy Access — $100'}
              </button>
              {error && <p style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9aa5b0', marginTop: '0.75rem' }}>No account required. Pay and get instant access.</p>
            </>
          )}
        </div>
      </div>

      {/* Refund policy */}
      <div style={{
        backgroundColor: '#f8fafd', border: '1px solid #e0eaf2',
        borderRadius: '10px', padding: '1.25rem 1.5rem',
        maxWidth: '640px', margin: '0 auto',
      }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5a6a7a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          Payments & Refunds
        </p>
        <p style={{ fontSize: '0.875rem', color: '#5a6a7a', lineHeight: 1.7 }}>
          All purchases are final and non-refundable. Access is granted immediately upon payment.
          If you purchase access and subsequently submit a salary that is approved, no refund will be issued
          for the prior payment. We encourage users to submit a salary first, as approved submissions
          are granted permanent free access to the database.
        </p>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: '3rem', maxWidth: '640px', margin: '3rem auto 0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2332', marginBottom: '1.25rem' }}>Common questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FAQ q="What counts as an approved submission?" a="You fill out the salary form completely and honestly. We review each submission for completeness before approving it. Most submissions are approved within 24–48 hours." />
          <FAQ q="Does my $100 renew automatically?" a="No. It is a one-time payment. After 12 months your access expires. You can purchase again at that time if you'd like to continue." />
          <FAQ q="Is my salary data really anonymous?" a="Yes. We collect no name, NPI, or any identifying information. Only your specialty, hospital name, city, state, and compensation details are stored." />
          <FAQ q="Do I need to create an account to buy?" a="No. Just enter your email at checkout. After payment, we'll send you a link to set up your password and access your account." />
        </div>
      </div>
    </div>
  )
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid #e0eaf2', borderRadius: '10px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '1rem 1.25rem', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontWeight: 600, fontSize: '0.9rem', color: '#1a2332',
        }}
      >
        {q}
        <span style={{ color: '#9aa5b0', fontSize: '1.1rem', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: '#5a6a7a', lineHeight: 1.7, borderTop: '1px solid #e0eaf2' }}>
          {a}
        </div>
      )}
    </div>
  )
}
