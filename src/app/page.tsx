import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'

async function getStats() {
  try {
    await connectDB()
    const approved = await Submission.find({ status: 'approved' }).lean()
    if (approved.length === 0) return { total: 0, hospitals: 0, states: 0, avgSalary: 0, highestSalary: 0 }

    const hospitals = new Set(approved.map((s: Record<string, unknown>) => String(s.hospitalName).toLowerCase())).size
    const states = new Set(approved.map((s: Record<string, unknown>) => s.state)).size
    const salaries = approved.map((s: Record<string, unknown>) => Number(s.annualBaseSalary)).filter(Boolean)
    const avgSalary = salaries.length ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0
    const highestSalary = salaries.length ? Math.max(...salaries) : 0

    return { total: approved.length, hospitals, states, avgSalary, highestSalary }
  } catch {
    return { total: 0, hospitals: 0, states: 0, avgSalary: 0, highestSalary: 0 }
  }
}

function formatSalary(n: number) {
  if (!n) return '—'
  return '$' + n.toLocaleString()
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1e5f8e 0%, #164a6e 60%, #0f3550 100%)',
        color: 'white',
        padding: '5rem 1.25rem 4rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(232, 160, 32, 0.2)',
            border: '1px solid rgba(232, 160, 32, 0.4)',
            borderRadius: '9999px',
            padding: '0.375rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#e8c060',
            marginBottom: '1.5rem',
            letterSpacing: '0.03em',
          }}>
            100% Anonymous · Physician-Submitted Data
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            Know Your Worth.<br />
            <span style={{ color: '#e8a020' }}>Share Your Salary.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: '580px',
            margin: '0 auto 2.5rem',
          }}>
            The first open salary database built by pediatricians, for pediatricians.
            Submit your compensation anonymously and help colleagues negotiate fair pay.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/submit" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Submit Your Salary
            </Link>
            <Link href="/salaries" className="btn btn-outline" style={{
              fontSize: '1rem',
              padding: '0.875rem 2rem',
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
            }}>
              Browse Salaries
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section style={{ padding: '2.5rem 1.25rem', backgroundColor: 'white', borderBottom: '1px solid #d0dde8' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          textAlign: 'center',
        }}>
          <StatItem value={stats.total.toString()} label="Salary Submissions" />
          <StatItem value={stats.hospitals.toString()} label="Hospitals & Institutions" />
          <StatItem value={stats.states.toString()} label="States Represented" />
          <StatItem value={formatSalary(stats.avgSalary)} label="Average Base Salary" />
          <StatItem value={formatSalary(stats.highestSalary)} label="Highest Reported Salary" />
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section style={{ padding: '4rem 1.25rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            color: '#1a2332',
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em',
          }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: '#5a6a7a', marginBottom: '3rem', fontSize: '1.05rem' }}>
            Built on transparency. Powered by physicians like you.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            <HowItWorksCard
              number="01"
              title="Submit Anonymously"
              desc="Share your salary, specialty, practice setting, and workload details. No name, no account required."
            />
            <HowItWorksCard
              number="02"
              title="We Review & Publish"
              desc="Each submission is reviewed before being added to the database to ensure data quality."
            />
            <HowItWorksCard
              number="03"
              title="Everyone Benefits"
              desc="Browse real compensation data by specialty, state, and career stage to negotiate with confidence."
            />
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #e8a020 0%, #c8880a 100%)',
        padding: '3.5rem 1.25rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
            fontWeight: 800,
            color: '#1a2332',
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em',
          }}>
            Be the First to Contribute
          </h2>
          <p style={{ color: '#3a2a00', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            The database grows with every submission. It takes 3 minutes and helps
            the entire pediatrics community negotiate fairer salaries.
          </p>
          <Link href="/submit" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem' }}>
            Submit Your Salary Now
          </Link>
        </div>
      </section>

      {/* ── Why it matters ────────────────────────────────── */}
      <section style={{ padding: '4rem 1.25rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
            fontWeight: 800,
            color: '#1a2332',
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em',
          }}>
            Why Salary Transparency Matters in Pediatrics
          </h2>
          <p style={{ textAlign: 'center', color: '#5a6a7a', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Pediatricians are among the most underpaid physicians. Knowing the market gives you power.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            <WhyCard icon="💼" title="Negotiate Better" desc="Walk into salary negotiations armed with real data from physicians in your specialty and state." />
            <WhyCard icon="🏥" title="Compare Settings" desc="See how academic medicine, private practice, and community health center salaries really stack up." />
            <WhyCard icon="📊" title="Track Market Trends" desc="As the database grows, you'll be able to see how compensation is shifting across specialties." />
          </div>
        </div>
      </section>
    </div>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1e5f8e', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#5a6a7a', marginTop: '0.25rem', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  )
}

function HowItWorksCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="card" style={{ position: 'relative', paddingTop: '1.75rem' }}>
      <div style={{
        position: 'absolute',
        top: '-1rem',
        left: '1.5rem',
        backgroundColor: '#1e5f8e',
        color: 'white',
        fontWeight: 800,
        fontSize: '0.8rem',
        padding: '0.25rem 0.6rem',
        borderRadius: '6px',
        letterSpacing: '0.05em',
      }}>
        {number}
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a2332', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#5a6a7a', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

function WhyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontSize: '1.75rem' }}>{icon}</div>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a2332' }}>{title}</h3>
      <p style={{ color: '#5a6a7a', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}
