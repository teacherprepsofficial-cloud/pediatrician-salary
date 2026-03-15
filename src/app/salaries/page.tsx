'use client'

import { useState, useEffect, useMemo } from 'react'
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

  // ── Filters ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterSetting, setFilterSetting] = useState('')

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
            Enter your email to browse real pediatrician salary data — submitted anonymously by pediatricians across the US.
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
            <Proof label="Pediatrician-Submitted" />
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
