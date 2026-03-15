'use client'

import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div style={{ maxWidth: '520px', margin: '5rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.75rem' }}>
        Payment successful!
      </h1>
      <p style={{ color: '#5a6a7a', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Your access to the PediatricianSalary.com database is now active for 12 months.
        Welcome to the community.
      </p>
      <Link href="/salaries" className="btn btn-secondary" style={{ fontSize: '1rem' }}>
        Browse Salaries →
      </Link>
    </div>
  )
}
