'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type User = { email: string; tier: 'none' | 'pro' | 'paid' } | null

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false) }, [pathname])

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user || null))
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backgroundColor: 'white', borderBottom: '1px solid #d0dde8',
      boxShadow: '0 1px 4px rgba(30, 95, 142, 0.06)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ color: '#1a2332', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
            PediatricianSalary<span style={{ color: '#1e5f8e' }}>.com</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          <NavLink href="/salaries">Browse Salaries</NavLink>
          <NavLink href="/about">About</NavLink>

          {user ? (
            <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'none', border: '2px solid #d0dde8', borderRadius: '6px',
                  padding: '0.4rem 0.875rem', cursor: 'pointer', fontSize: '0.875rem',
                  fontWeight: 600, color: '#1a2332', transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  backgroundColor: '#1e5f8e', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {user.email[0].toUpperCase()}
                </span>
                {user.email.split('@')[0].slice(0, 12)}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                  backgroundColor: 'white', border: '1px solid #d0dde8',
                  borderRadius: '10px', boxShadow: '0 8px 24px rgba(30,95,142,0.12)',
                  minWidth: '180px', overflow: 'hidden', zIndex: 100,
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e8eff6' }}>
                    <p style={{ fontSize: '0.75rem', color: '#9aa5b0', fontWeight: 500 }}>{user.email}</p>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: user.tier === 'pro' ? '#16a34a' : user.tier === 'paid' ? '#1e5f8e' : '#9aa5b0', marginTop: '0.1rem', textTransform: 'capitalize' }}>
                      {user.tier === 'pro' ? 'Pro' : user.tier === 'paid' ? 'Paid' : 'No Access'}
                    </p>
                  </div>
                  <Link href="/account" style={{ display: 'block', padding: '0.625rem 1rem', fontSize: '0.875rem', color: '#1a2332', textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f5fa')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                  >My Account</Link>
                  <button onClick={logout} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.625rem 1rem', fontSize: '0.875rem', color: '#dc2626',
                    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500,
                    borderTop: '1px solid #e8eff6',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{
              color: '#8C1A4A',
              fontWeight: 700,
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              marginLeft: '0.25rem',
              border: '2px solid #8C1A4A',
              backgroundColor: 'transparent',
              transition: 'all 0.15s ease',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(140,26,74,0.06)'
                ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLElement).style.transform = ''
              }}
            >
              Log In
            </Link>
          )}

          <Link href="/submit" style={{
            backgroundColor: '#8C1A4A', color: 'white', fontWeight: 700,
            padding: '0.5rem 1.25rem', borderRadius: '6px', textDecoration: 'none',
            fontSize: '0.9rem', marginLeft: '0.5rem', border: '2px solid #8C1A4A',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}>
            Submit Your Salary
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#1a2332' }}
          className="show-mobile"
        >
          {menuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: 'white', borderTop: '1px solid #d0dde8',
          padding: '1rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column',
          gap: '0.25rem', boxShadow: '0 8px 24px rgba(30, 95, 142, 0.1)',
        }}>
          <MobileNavLink href="/salaries">Browse Salaries</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          {user ? (
            <>
              <MobileNavLink href="/account">My Account ({user.tier === 'pro' ? 'Pro' : user.tier === 'paid' ? 'Paid' : 'No Access'})</MobileNavLink>
              <button onClick={logout} style={{
                textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                color: '#dc2626', fontWeight: 500, fontSize: '1rem',
                padding: '0.75rem 0.5rem', borderBottom: '1px solid #e8eff6',
              }}>Sign out</button>
            </>
          ) : (
            <Link href="/login" style={{
              display: 'block', marginTop: '0.5rem',
              color: '#8C1A4A', fontWeight: 700, padding: '0.875rem 1.25rem',
              borderRadius: '6px', textDecoration: 'none', textAlign: 'center',
              fontSize: '1rem', border: '2px solid #8C1A4A', backgroundColor: 'transparent',
            }}>
              Log In
            </Link>
          )}
          <Link href="/submit" style={{
            display: 'block', marginTop: '0.5rem',
            backgroundColor: '#8C1A4A', color: 'white', fontWeight: 700,
            padding: '0.875rem 1.25rem', borderRadius: '6px',
            textDecoration: 'none', textAlign: 'center', fontSize: '1rem',
          }}>
            Submit Your Salary
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 640px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 639px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: '#5a6a7a', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', padding: '0.5rem 0.75rem', borderRadius: '6px', transition: 'background-color 0.15s, color 0.15s' }}
      onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = '#f0f5fa'; (e.target as HTMLElement).style.color = '#1a2332' }}
      onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = ''; (e.target as HTMLElement).style.color = '#5a6a7a' }}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: '#1a2332', textDecoration: 'none', fontWeight: 500, fontSize: '1rem', padding: '0.75rem 0.5rem', borderBottom: '1px solid #e8eff6', display: 'block' }}>
      {children}
    </Link>
  )
}
