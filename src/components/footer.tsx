import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{
      backgroundColor: '#164a6e',
      color: 'rgba(255,255,255,0.8)',
      padding: '3rem 1.25rem 2rem',
      marginTop: '4rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                PediatricianSalary.com
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.65)' }}>
              Real salary data, shared anonymously by pediatricians across the US.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explore
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/salaries">Browse Salaries</FooterLink>
              <FooterLink href="/submit">Submit Your Salary</FooterLink>
              <FooterLink href="/about">About</FooterLink>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Legal
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Use</FooterLink>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            All salary data is submitted anonymously. Individual submissions are not publicly displayed without review.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} PediatricianSalary.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: 'rgba(255,255,255,0.65)',
      textDecoration: 'none',
      fontSize: '0.875rem',
      transition: 'color 0.15s',
    }}>
      {children}
    </Link>
  )
}
