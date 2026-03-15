import Link from 'next/link'

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
        About PediatricianSalary.com
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: '#374151', fontSize: '1rem', lineHeight: 1.8 }}>
        <p>
          PediatricianSalary.com is a free, open salary database built by physicians, for physicians.
          Our goal is simple: give pediatricians access to real compensation data so they can negotiate
          confidently and understand what fair pay looks like in their specialty and region.
        </p>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a2332', marginTop: '0.5rem' }}>
          How submissions work
        </h2>
        <p>
          Anyone can submit their salary anonymously. No account required. We review each submission
          before it goes live to ensure data quality and remove any identifying information.
          Submissions typically appear within a few days of being received.
        </p>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a2332', marginTop: '0.5rem' }}>
          Privacy
        </h2>
        <p>
          We do not collect names, email addresses, or any identifying information as part of salary
          submissions. IP addresses are used only for rate limiting and are not stored permanently.
          See our <Link href="/privacy" style={{ color: '#1e5f8e', fontWeight: 500 }}>Privacy Policy</Link> for details.
        </p>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a2332', marginTop: '0.5rem' }}>
          Contact
        </h2>
        <p>
          Questions or feedback? Reach us at{' '}
          <a href="mailto:thejacksonhennessy@gmail.com" style={{ color: '#1e5f8e', fontWeight: 500 }}>
            thejacksonhennessy@gmail.com
          </a>
        </p>

        <div style={{ marginTop: '1rem' }}>
          <Link href="/submit" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Submit Your Salary
          </Link>
        </div>
      </div>
    </div>
  )
}
