'use client'

import { useState, useEffect, useCallback } from 'react'

type Submission = {
  _id: string
  hospitalName: string
  city: string
  state: string
  rating: number
  specialty: string
  careerStage: string
  annualBaseSalary: number
  receivedSignOnBonus: string
  signOnBonusAmount: string
  productivityBonus: string
  hasMoonlighting: string
  moonlightingIncome: string
  fteStatus: string
  avgClinicalHoursPerWeek: string
  callFrequency: string
  yearsInRole: string
  pslfEligible: string
  practiceSetting: string
  housingStipend: string
  programUnionized: string
  additionalComments: string
  status: string
  submittedAt: string
}

const TABS = ['pending', 'approved', 'rejected'] as const
type Tab = typeof TABS[number]

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [savedSecret, setSavedSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('pending')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  // Persist secret in sessionStorage
  useEffect(() => {
    const s = sessionStorage.getItem('admin_secret')
    if (s) { setSavedSecret(s); setAuthed(true) }
  }, [])

  const fetchSubmissions = useCallback(async (s: string, t: Tab) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/submissions?status=${t}`, {
        headers: { 'x-admin-secret': s },
      })
      if (res.status === 401) { setAuthed(false); setError('Invalid password.'); return }
      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch {
      setError('Failed to load submissions.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed && savedSecret) fetchSubmissions(savedSecret, tab)
  }, [authed, savedSecret, tab, fetchSubmissions])

  function login() {
    if (!secret.trim()) return
    sessionStorage.setItem('admin_secret', secret)
    setSavedSecret(secret)
    setAuthed(true)
  }

  function logout() {
    sessionStorage.removeItem('admin_secret')
    setSavedSecret('')
    setAuthed(false)
    setSubmissions([])
  }

  async function action(id: string, status: 'approved' | 'rejected') {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': savedSecret },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setSubmissions(s => s.filter(x => x._id !== id))
      showToast(status === 'approved' ? '✓ Approved' : '✕ Rejected')
    } catch {
      showToast('Action failed — try again')
    } finally {
      setActionLoading(null)
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  if (!authed) {
    return (
      <div style={{ maxWidth: '400px', margin: '6rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.5rem' }}>Admin Login</h1>
        <p style={{ color: '#5a6a7a', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter your admin password to continue.</p>
        <input
          type="password"
          className="form-input"
          placeholder="Admin password"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ marginBottom: '1rem', textAlign: 'center' }}
          autoFocus
        />
        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
        <button onClick={login} className="btn btn-secondary" style={{ width: '100%' }}>
          Sign In
        </button>
      </div>
    )
  }

  const pendingCount = tab === 'pending' ? submissions.length : null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.01em' }}>
            Submission Review
          </h1>
          <p style={{ color: '#5a6a7a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review and approve salary submissions before they go live.
          </p>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', color: '#5a6a7a', cursor: 'pointer', fontSize: '0.875rem' }}>
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '2px solid #e0eaf2', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.6rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: tab === t ? '#1e5f8e' : '#5a6a7a',
              borderBottom: tab === t ? '2px solid #1e5f8e' : '2px solid transparent',
              marginBottom: '-2px',
              textTransform: 'capitalize',
              transition: 'color 0.15s',
            }}
          >
            {t}
            {t === 'pending' && pendingCount !== null && pendingCount > 0 && (
              <span style={{
                marginLeft: '0.5rem',
                backgroundColor: '#e8a020',
                color: '#1a2332',
                borderRadius: '9999px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => fetchSubmissions(savedSecret, tab)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#1e5f8e', fontSize: '0.85rem', fontWeight: 500, padding: '0.6rem 0.5rem' }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Content */}
      {loading && <p style={{ color: '#5a6a7a', textAlign: 'center', padding: '3rem' }}>Loading…</p>}
      {error && <p style={{ color: '#dc2626', textAlign: 'center', padding: '2rem' }}>{error}</p>}

      {!loading && !error && submissions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5a6a7a' }}>
          No {tab} submissions.
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map(s => (
            <div key={s._id} style={{
              backgroundColor: 'white',
              border: `1px solid ${s.status === 'pending' ? '#d0dde8' : s.status === 'approved' ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a2332' }}>{s.specialty}</div>
                  <div style={{ color: '#5a6a7a', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                    {s.hospitalName} · {s.city}, {s.state}
                  </div>
                  <div style={{ color: '#5a6a7a', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    Submitted: {new Date(s.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e5f8e' }}>
                    ${s.annualBaseSalary.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#5a6a7a' }}>annual base</div>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.4rem 1.5rem', fontSize: '0.85rem', color: '#374151', marginBottom: '1rem' }}>
                <Detail label="Career Stage" value={s.careerStage} />
                <Detail label="FTE" value={s.fteStatus} />
                <Detail label="Years in Role" value={s.yearsInRole} />
                <Detail label="Practice Setting" value={s.practiceSetting} />
                <Detail label="Rating" value={`${s.rating}/10`} />
                <Detail label="Sign-on Bonus" value={s.receivedSignOnBonus + (s.signOnBonusAmount ? ` ($${s.signOnBonusAmount})` : '')} />
                <Detail label="Productivity Bonus" value={s.productivityBonus} />
                <Detail label="Moonlighting" value={s.hasMoonlighting + (s.moonlightingIncome ? ` ($${s.moonlightingIncome})` : '')} />
                <Detail label="Avg Hours/Week" value={s.avgClinicalHoursPerWeek || '—'} />
                <Detail label="Call Frequency" value={s.callFrequency || '—'} />
                <Detail label="PSLF Eligible" value={s.pslfEligible || '—'} />
                <Detail label="Housing Stipend" value={s.housingStipend || '—'} />
                <Detail label="Unionized" value={s.programUnionized || '—'} />
              </div>

              {s.additionalComments && (
                <div style={{ backgroundColor: '#f8fafd', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151', marginBottom: '1rem', borderLeft: '3px solid #d0dde8' }}>
                  <span style={{ fontWeight: 600, color: '#5a6a7a' }}>Comments: </span>{s.additionalComments}
                </div>
              )}

              {/* Actions */}
              {s.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => action(s._id, 'approved')}
                    disabled={actionLoading === s._id}
                    style={{
                      backgroundColor: '#16a34a', color: 'white',
                      border: 'none', borderRadius: '6px',
                      padding: '0.5rem 1.25rem', fontWeight: 700,
                      fontSize: '0.875rem', cursor: 'pointer',
                      opacity: actionLoading === s._id ? 0.6 : 1,
                    }}
                  >
                    {actionLoading === s._id ? '…' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => action(s._id, 'rejected')}
                    disabled={actionLoading === s._id}
                    style={{
                      backgroundColor: 'white', color: '#dc2626',
                      border: '1px solid #fca5a5', borderRadius: '6px',
                      padding: '0.5rem 1.25rem', fontWeight: 700,
                      fontSize: '0.875rem', cursor: 'pointer',
                      opacity: actionLoading === s._id ? 0.6 : 1,
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}

              {s.status !== 'pending' && (
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: s.status === 'approved' ? '#16a34a' : '#dc2626', textTransform: 'capitalize' }}>
                  {s.status === 'approved' ? '✓' : '✕'} {s.status}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1a2332', color: 'white',
          padding: '0.75rem 1.5rem', borderRadius: '8px',
          fontSize: '0.9rem', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 100,
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: '#9aa5b0', fontWeight: 500 }}>{label}: </span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}
