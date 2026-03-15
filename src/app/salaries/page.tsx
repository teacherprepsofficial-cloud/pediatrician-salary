import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'

async function getApprovedSalaries() {
  try {
    await connectDB()
    return await Submission.find({ status: 'approved' }).sort({ submittedAt: -1 }).lean()
  } catch {
    return []
  }
}

function formatSalary(n: number) {
  return '$' + n.toLocaleString()
}

function ratingColor(r: number) {
  if (r >= 8) return '#16a34a'
  if (r >= 5) return '#e8a020'
  return '#dc2626'
}

export default async function SalariesPage() {
  const salaries = await getApprovedSalaries()

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
          Pediatrician Salaries
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '1rem' }}>
          {salaries.length} {salaries.length === 1 ? 'submission' : 'submissions'} from physicians across the US
        </p>
      </div>

      {salaries.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {salaries.map((s: Record<string, unknown>) => (
            <div key={String(s._id)} className="salary-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a2332', marginBottom: '0.25rem' }}>
                    {String(s.specialty)}
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

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                <Tag label={String(s.careerStage)} />
                <Tag label={String(s.fteStatus)} />
                <Tag label={`${String(s.yearsInRole)} yr${String(s.yearsInRole) === '1' ? '' : 's'}`} />
                {s.practiceSetting ? <Tag label={String(s.practiceSetting)} /> : null}
                {s.productivityBonus && s.productivityBonus !== 'No' ? <Tag label={String(s.productivityBonus)} color="#e8f1f8" textColor="#1e5f8e" /> : null}
                {s.pslfEligible === 'Yes' ? <Tag label="PSLF Eligible" color="#dcfce7" textColor="#16a34a" /> : null}
              </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
