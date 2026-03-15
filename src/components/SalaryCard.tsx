'use client'

import { useState } from 'react'

type Props = {
  s: Record<string, unknown>
}

function formatSalary(n: number) {
  return '$' + n.toLocaleString()
}

function ratingColor(r: number) {
  if (r >= 8) return '#16a34a'
  if (r >= 5) return '#e8a020'
  return '#dc2626'
}

function Tag({ label, color = '#f0f5fa', textColor = '#5a6a7a' }: { label: string; color?: string; textColor?: string }) {
  return (
    <span style={{
      backgroundColor: color,
      color: textColor,
      fontSize: '0.78rem',
      fontWeight: 600,
      padding: '0.25rem 0.625rem',
      borderRadius: '9999px',
    }}>
      {label}
    </span>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value || value === '' || value === 'No' || value === 'undefined') return null
  return (
    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
      <span style={{ color: '#9aa5b0', fontWeight: 500, minWidth: '180px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1a2332', fontWeight: 600 }}>{value}</span>
    </div>
  )
}

export function SalaryCard({ s }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="salary-card"
      style={{ cursor: 'pointer' }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* ── Summary row ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a2332', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {String(s.specialty)}
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ color: '#9aa5b0', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ color: '#5a6a7a', fontSize: '0.875rem' }}>
            {String(s.hospitalName)} · {String(s.city)}, {String(s.state)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e5f8e' }}>
            {formatSalary(Number(s.annualBaseSalary))}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#5a6a7a' }}>annual base salary</div>
        </div>
      </div>

      {/* ── Tags ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
        <Tag label={String(s.careerStage)} />
        <Tag label={String(s.fteStatus)} />
        <Tag label={`${String(s.yearsInRole)} yr${String(s.yearsInRole) === '1' ? '' : 's'}`} />
        {s.practiceSetting ? <Tag label={String(s.practiceSetting)} /> : null}
        {s.productivityBonus && s.productivityBonus !== 'No' ? <Tag label={String(s.productivityBonus)} color="#e8f1f8" textColor="#1e5f8e" /> : null}
        {s.pslfEligible === 'Yes' ? <Tag label="PSLF Eligible" color="#dcfce7" textColor="#16a34a" /> : null}
      </div>

      {/* ── Rating + sign-on ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #e8eff6' }}>
        <span style={{ fontSize: '0.8rem', color: '#5a6a7a' }}>Hospital rating:</span>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: ratingColor(Number(s.rating)) }}>
          {String(s.rating)}/10
        </span>
        {s.receivedSignOnBonus === 'Yes' ? (
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
            ✓ Sign-on bonus
          </span>
        ) : null}
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #e8eff6',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
        onClick={e => e.stopPropagation()}
        >
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9aa5b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
            Full Details
          </p>

          <DetailRow label="Sign-on / Relocation Bonus" value={String(s.receivedSignOnBonus)} />
          {s.receivedSignOnBonus === 'Yes' && s.signOnBonusAmount
            ? <DetailRow label="Sign-on Bonus Amount" value={`$${String(s.signOnBonusAmount)}`} />
            : null
          }
          <DetailRow label="Productivity / Incentive Bonus" value={String(s.productivityBonus)} />
          <DetailRow label="Moonlighting Available" value={String(s.hasMoonlighting)} />
          {s.hasMoonlighting === 'Yes' && s.moonlightingIncome
            ? <DetailRow label="Est. Moonlighting Income" value={`$${String(s.moonlightingIncome)}`} />
            : null
          }
          <DetailRow label="Avg Clinical Hours / Week" value={s.avgClinicalHoursPerWeek ? String(s.avgClinicalHoursPerWeek) : ''} />
          <DetailRow label="Call Frequency" value={s.callFrequency ? String(s.callFrequency) : ''} />
          <DetailRow label="PSLF Eligible" value={s.pslfEligible ? String(s.pslfEligible) : ''} />
          <DetailRow label="Housing Stipend" value={s.housingStipend ? String(s.housingStipend) : ''} />
          <DetailRow label="Program Unionized" value={s.programUnionized ? String(s.programUnionized) : ''} />

          {s.additionalComments && String(s.additionalComments).trim() ? (
            <div style={{
              marginTop: '0.5rem',
              backgroundColor: '#f8fafd',
              borderRadius: '8px',
              padding: '0.875rem 1rem',
              borderLeft: '3px solid #d0dde8',
            }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9aa5b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Comments</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>{String(s.additionalComments)}</p>
            </div>
          ) : null}
        </div>
      )}

      {!expanded && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#9aa5b0', textAlign: 'right' }}>
          Click to see full details
        </div>
      )}
    </div>
  )
}
