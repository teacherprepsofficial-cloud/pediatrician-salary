import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'

// ── Free Unsplash photos (Vitaly Gariev / CDC / Bermix Studio) ───────────────
const PHOTOS = {
  heroRight:   'https://images.unsplash.com/photo-1758691463080-30a990ef61bb?w=900&h=700&fit=crop&q=85',
  showcase1:   'https://images.unsplash.com/photo-1632052999447-e542d08d4f7d?w=600&h=500&fit=crop&q=85',
  showcase2:   'https://images.unsplash.com/photo-1758691462445-d03a94aa7656?w=600&h=500&fit=crop&q=85',
  showcase3:   'https://images.unsplash.com/photo-1758691463331-2ac00e6f676f?w=600&h=500&fit=crop&q=85',
  whySide:     'https://images.unsplash.com/photo-1676313030076-4ac0b37050fd?w=700&h=600&fit=crop&q=85',
  ctaAccent:   'https://images.unsplash.com/photo-1758691462164-100b5e356169?w=1400&h=500&fit=crop&q=80',
}

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
      <section style={{ overflow: 'hidden' }}>
        <div className="hero-grid">

          {/* Left: text + CTAs */}
          <div style={{
            background: 'linear-gradient(140deg, #1e5f8e 0%, #164a6e 55%, #0f3550 100%)',
            color: 'white',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'inline-block',
              alignSelf: 'flex-start',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'white',
              marginBottom: '1.5rem',
              letterSpacing: '0.03em',
            }}>
              100% Anonymous · Pediatrician-Submitted Data
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
              textAlign: 'left',
            }}>
              Know Your Worth.<br />
              <span style={{ color: '#e8a0bf' }}>Share Your Salary.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '440px',
              textAlign: 'left',
            }}>
              The first open salary database built specifically for pediatricians.
              Submit your compensation anonymously and help colleagues negotiate fair pay.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/submit" className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '0.75rem 1.75rem' }}>
                Submit Your Salary
              </Link>
              <Link href="/salaries" className="btn btn-outline" style={{
                fontSize: '0.95rem',
                padding: '0.75rem 1.75rem',
                borderColor: '#B8860B',
                color: 'white',
                backgroundColor: '#B8860B',
              }}>
                Browse Salaries
              </Link>
            </div>
          </div>

          {/* Right: photo */}
          <div className="hero-image-panel">
            <img
              src={PHOTOS.heroRight}
              alt="Pediatrician examining young patient"
              loading="eager"
            />
          </div>

        </div>
      </section>

      {/* ── Stats (only when there's real data) ───────────── */}
      {stats.total > 0 && (
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
      )}

      {/* ── Photo showcase ────────────────────────────────── */}
      <section style={{ padding: '4rem 1.25rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 800,
              color: '#1a2332',
              letterSpacing: '-0.01em',
              marginBottom: '0.6rem',
            }}>
              Real Pediatricians. Real Transparency.
            </h2>
            <p style={{ color: '#5a6a7a', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Every data point comes from a pediatrician who took 3 minutes to help the entire community.
            </p>
          </div>

          <div className="photo-showcase-grid">
            <ShowcasePhoto
              src={PHOTOS.showcase1}
              alt="Female pediatrician examining infant with stethoscope"
              caption="Every specialty, every setting"
            />
            <ShowcasePhoto
              src={PHOTOS.showcase2}
              alt="Pediatrician with young boy and parent"
              caption="Attendings, fellows & residents"
            />
            <ShowcasePhoto
              src={PHOTOS.showcase3}
              alt="Doctor examining young child with parent present"
              caption="50 states represented"
            />
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section style={{ padding: '4rem 1.25rem', backgroundColor: '#f0f5fa' }}>
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
            Built on transparency. Powered by pediatricians like you.
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

      {/* ── Why it matters ────────────────────────────────── */}
      <section style={{ padding: '4rem 1.25rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div className="why-split">

            {/* Left: image */}
            <div className="why-split-image" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(30,95,142,0.14)' }}>
              <img
                src={PHOTOS.whySide}
                alt="Pediatrician examining child during checkup"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '420px' }}
              />
            </div>

            {/* Right: cards */}
            <div>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                fontWeight: 800,
                color: '#1a2332',
                marginBottom: '0.6rem',
                letterSpacing: '-0.01em',
              }}>
                Why Salary Transparency Matters in Pediatrics
              </h2>
              <p style={{ color: '#5a6a7a', marginBottom: '1.75rem', fontSize: '1rem', lineHeight: 1.7 }}>
                Salary data is power. Know what your peers are earning so you can negotiate with confidence.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <WhyCard icon="💼" title="Negotiate Better" desc="Walk into salary negotiations armed with real data from pediatricians in your specialty and state." />
                <WhyCard icon="🏥" title="Compare Settings" desc="See how academic medicine, private practice, and community health center salaries really stack up." />
                <WhyCard icon="📊" title="Track Market Trends" desc="As the database grows, you'll see how compensation shifts across specialties over time." />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA banner with photo overlay ─────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={PHOTOS.ctaAccent}
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.18,
          }}
        />
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #B8860B 0%, #9a6f09 100%)',
          padding: '3.5rem 1.25rem',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}>
              Your Salary Helps the Whole Community
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Once you submit, your data is reviewed and added to the database — where other
              pediatricians can see what fair compensation actually looks like in their specialty and state.
            </p>
            <Link href="/submit" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem' }}>
              Submit Your Salary Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ShowcasePhoto({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,95,142,0.10)', position: 'relative' }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(15,53,80,0.85) 0%, transparent 100%)',
        padding: '2rem 1.25rem 1rem',
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}>
        {caption}
      </div>
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
    <div style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
      padding: '1rem 1.25rem',
      backgroundColor: '#f8fafd',
      borderRadius: '10px',
      border: '1px solid #e0eaf2',
    }}>
      <div style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>{icon}</div>
      <div>
        <h3 style={{ fontWeight: 700, fontSize: '0.975rem', color: '#1a2332', marginBottom: '0.3rem' }}>{title}</h3>
        <p style={{ color: '#5a6a7a', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  )
}
