'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'white',
      borderBottom: '1px solid #d0dde8',
      boxShadow: '0 1px 4px rgba(30, 95, 142, 0.06)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#1e5f8e',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}>
            🩺
          </div>
          <span style={{
            color: '#1a2332',
            fontWeight: 700,
            fontSize: '1.05rem',
            letterSpacing: '-0.01em',
          }}>
            PediatricianSalary<span style={{ color: '#1e5f8e' }}>.com</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          <NavLink href="/salaries">Browse Salaries</NavLink>
          <NavLink href="/about">About</NavLink>
          <Link href="/submit" style={{
            backgroundColor: '#e8a020',
            color: '#1a2332',
            fontWeight: 700,
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginLeft: '0.5rem',
            border: '2px solid #e8a020',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}>
            Submit Your Salary
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: '#1a2332',
          }}
          className="show-mobile"
        >
          {menuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: 'white',
          borderTop: '1px solid #d0dde8',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          boxShadow: '0 8px 24px rgba(30, 95, 142, 0.1)',
        }}>
          <MobileNavLink href="/salaries">Browse Salaries</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <Link href="/submit" style={{
            display: 'block',
            marginTop: '0.75rem',
            backgroundColor: '#e8a020',
            color: '#1a2332',
            fontWeight: 700,
            padding: '0.875rem 1.25rem',
            borderRadius: '6px',
            textDecoration: 'none',
            textAlign: 'center',
            fontSize: '1rem',
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
    <Link href={href} style={{
      color: '#5a6a7a',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '0.9rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '6px',
      transition: 'background-color 0.15s, color 0.15s',
    }}
    onMouseEnter={e => {
      (e.target as HTMLElement).style.backgroundColor = '#f0f5fa'
      ;(e.target as HTMLElement).style.color = '#1a2332'
    }}
    onMouseLeave={e => {
      (e.target as HTMLElement).style.backgroundColor = ''
      ;(e.target as HTMLElement).style.color = '#5a6a7a'
    }}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: '#1a2332',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '1rem',
      padding: '0.75rem 0.5rem',
      borderBottom: '1px solid #e8eff6',
      display: 'block',
    }}>
      {children}
    </Link>
  )
}
