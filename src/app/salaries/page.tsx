'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { SalaryCard } from '@/components/SalaryCard'

type User = { email: string; tier: 'none' | 'pro' | 'paid' } | null

export default function SalariesPage() {
  const [user, setUser] = useState<User>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [salaries, setSalaries] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)

  // ── Filters ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterSetting, setFilterSetting] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        setUser(d.user || null)
        if (d.user && (d.user.tier === 'pro' || d.user.tier === 'paid')) {
          fetchSalaries()
        }
      })
      .finally(() => setAuthLoading(false))
  }, [])

  async function fetchSalaries() {
    setLoading(true)
    try {
      const res = await fetch('/api/salaries')
      const data = await res.json()
      setSalaries(data.salaries || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  // ── Derived filter options (from real data) ───────────────────────────────
  const stateOptions = useMemo(() =>
    [...new Set(salaries.map(s => String(s.state)).filter(Boolean))].sort()
  , [salaries])

  const specialtyOptions = useMemo(() =>
    [...new Set(salaries.map(s => String(s.specialty)).filter(Boolean))].sort()
  , [salaries])

  const settingOptions = useMemo(() =>
    [...new Set(salaries.map(s => String(s.practiceSetting)).filter(Boolean))].sort()
  , [salaries])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return salaries.filter(s => {
      if (q) {
        const haystack = [s.specialty, s.hospitalName, s.city, s.state, s.careerStage, s.practiceSetting]
          .map(v => String(v ?? '').toLowerCase()).join(' ')
        if (!haystack.includes(q)) return false
      }
      if (filterState && s.state !== filterState) return false
      if (filterSpecialty && s.specialty !== filterSpecialty) return false
      if (filterStage && s.careerStage !== filterStage) return false
      if (filterSetting && s.practiceSetting !== filterSetting) return false
      return true
    })
  }, [salaries, search, filterState, filterSpecialty, filterStage, filterSetting])

  const hasFilters = search || filterState || filterSpecialty || filterStage || filterSetting

  function clearFilters() {
    setSearch('')
    setFilterState('')
    setFilterSpecialty('')
    setFilterStage('')
    setFilterSetting('')
  }

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a7a' }}>Loading…</div>
  }

  // ── No access gate ────────────────────────────────────────────────────────
  const hasAccess = user && (user.tier === 'pro' || user.tier === 'paid')

  if (!hasAccess) {
    // Logged in but pending review
    if (user && user.tier === 'none') {
      return (
        <div style={{
          minHeight: '80vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '2rem 1.25rem',
          background: 'linear-gradient(160deg, #f0f5fa 0%, #e4edf5 100%)',
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', border: '1px solid #d0dde8',
            boxShadow: '0 8px 40px rgba(30,95,142,0.10)',
            padding: 'clamp(2rem, 5vw, 3rem)', maxWidth: '480px', width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.75rem' }}>
              Your submission is under review
            </h1>
            <p style={{ color: '#5a6a7a', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              You&apos;ll get an email and full access once it&apos;s approved — usually within 24–48 hours.
              Need access now?
            </p>
            <Link href="/pricing" className="btn btn-primary" style={{ fontSize: '0.95rem' }}>
              Get Instant Access for $100 →
            </Link>
          </div>
        </div>
      )
    }

    // Unauthenticated — show two-column gate
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '3rem 1.25rem',
        background: 'linear-gradient(160deg, #f0f5fa 0%, #e4edf5 100%)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Access the Salary Database
          </h1>
          <p style={{ color: '#5a6a7a', fontSize: '1rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
            Real salaries submitted anonymously by pediatricians across the US.
          </p>
        </div>

        {/* Three columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1.25rem',
          width: '100%',
          maxWidth: '820px',
        }}>
          {/* 1. Log In */}
          <div style={{
            backgroundColor: 'white', borderRadius: '14px',
            border: '2px solid #1e5f8e', padding: '1.75rem',
            display: 'flex', flexDirection: 'column', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#1e5f8e', color: 'white', fontWeight: 700,
              fontSize: '0.7rem', padding: '0.25rem 0.875rem', borderRadius: '9999px',
              letterSpacing: '0.05em', whiteSpace: 'nowrap',
            }}>Welcome back!</div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
              Log in
            </h2>
            <p style={{ color: '#5a6a7a', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
              Access the database with your existing account.
            </p>
            <Link href="/login?redirect=/salaries" className="btn btn-secondary" style={{ textAlign: 'center', display: 'block' }}>
              Log In
            </Link>
          </div>

          {/* 2. Submit Your Salary */}
          <div style={{
            backgroundColor: 'white', borderRadius: '14px',
            border: '2px solid #8C1A4A', padding: '1.75rem',
            display: 'flex', flexDirection: 'column', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#8C1A4A', color: 'white', fontWeight: 700,
              fontSize: '0.7rem', padding: '0.25rem 0.875rem', borderRadius: '9999px',
              letterSpacing: '0.05em', whiteSpace: 'nowrap',
            }}>For existing pediatricians</div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
              Submit your salary
            </h2>
            <p style={{ color: '#5a6a7a', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
              Share your salary anonymously and get <strong>permanent free access</strong> once approved.
            </p>
            <Link href="/submit" className="btn btn-primary" style={{ textAlign: 'center', display: 'block' }}>
              Submit a Salary
            </Link>
          </div>

          {/* 3. Buy Access */}
          <div style={{
            backgroundColor: 'white', borderRadius: '14px',
            border: '2px solid #B8860B', padding: '1.75rem',
            display: 'flex', flexDirection: 'column', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#B8860B', color: 'white', fontWeight: 700,
              fontSize: '0.7rem', padding: '0.25rem 0.875rem', borderRadius: '9999px',
              letterSpacing: '0.05em', whiteSpace: 'nowrap',
            }}>For future pediatricians</div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
              Get full access
            </h2>
            <p style={{ color: '#5a6a7a', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
              Instant access to the full database for 12 months. No account required.
            </p>
            <Link href="/pricing" style={{ textAlign: 'center', display: 'block', backgroundColor: '#B8860B', color: 'white', fontWeight: 700, padding: '0.75rem 1.25rem', borderRadius: '6px', textDecoration: 'none', fontSize: '1rem' }}>
              Get Access Now
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Proof label="100% Anonymous" />
          <Proof label="Pediatrician-Submitted" />
          <Proof label="Reviewed & Approved" />
        </div>
      </div>
    )
  }

  // ── Salary list ───────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
          Pediatrician Salaries
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '1rem' }}>
          {loading ? 'Loading…' : `${filtered.length} of ${salaries.length} ${salaries.length === 1 ? 'submission' : 'submissions'} from pediatricians across the US`}
        </p>
      </div>

      {/* Search + Filters */}
      {!loading && salaries.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #d0dde8',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
              color: '#9aa5b0', pointerEvents: 'none', fontSize: '1rem',
            }}>🔍</span>
            <input
              type="text"
              className="form-input"
              placeholder="Search by specialty, hospital, city, or state…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filter row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* Career Stage pills */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['Resident', 'Fellow', 'Attending'].map(stage => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setFilterStage(filterStage === stage ? '' : stage)}
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '9999px',
                    border: `2px solid ${filterStage === stage ? '#1e5f8e' : '#d0dde8'}`,
                    backgroundColor: filterStage === stage ? '#1e5f8e' : 'white',
                    color: filterStage === stage ? 'white' : '#5a6a7a',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {stage}
                </button>
              ))}
            </div>

            {/* State select */}
            {stateOptions.length > 1 && (
              <select
                value={filterState}
                onChange={e => setFilterState(e.target.value)}
                style={{
                  border: `2px solid ${filterState ? '#1e5f8e' : '#d0dde8'}`,
                  borderRadius: '9999px',
                  padding: '0.3rem 2rem 0.3rem 0.875rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: filterState ? '#1e5f8e' : '#5a6a7a',
                  backgroundColor: filterState ? '#e8f1f8' : 'white',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235a6a7a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.1em',
                  outline: 'none',
                }}
              >
                <option value="">All States</option>
                {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}

            {/* Specialty select */}
            {specialtyOptions.length > 1 && (
              <select
                value={filterSpecialty}
                onChange={e => setFilterSpecialty(e.target.value)}
                style={{
                  border: `2px solid ${filterSpecialty ? '#1e5f8e' : '#d0dde8'}`,
                  borderRadius: '9999px',
                  padding: '0.3rem 2rem 0.3rem 0.875rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: filterSpecialty ? '#1e5f8e' : '#5a6a7a',
                  backgroundColor: filterSpecialty ? '#e8f1f8' : 'white',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235a6a7a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.1em',
                  outline: 'none',
                  maxWidth: '220px',
                }}
              >
                <option value="">All Specialties</option>
                {specialtyOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}

            {/* Practice Setting select */}
            {settingOptions.length > 1 && (
              <select
                value={filterSetting}
                onChange={e => setFilterSetting(e.target.value)}
                style={{
                  border: `2px solid ${filterSetting ? '#1e5f8e' : '#d0dde8'}`,
                  borderRadius: '9999px',
                  padding: '0.3rem 2rem 0.3rem 0.875rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: filterSetting ? '#1e5f8e' : '#5a6a7a',
                  backgroundColor: filterSetting ? '#e8f1f8' : 'white',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2020/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235a6a7a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.1em',
                  outline: 'none',
                  maxWidth: '220px',
                }}
              >
                <option value="">All Settings</option>
                {settingOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#8C1A4A',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  padding: '0.3rem 0',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                × Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5a6a7a' }}>Loading salaries…</div>
      )}

      {!loading && salaries.length === 0 && <EmptyState />}

      {!loading && salaries.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5a6a7a', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #d0dde8' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No results match your filters.</p>
          <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#1e5f8e', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            Clear all filters
          </button>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(s => (
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
