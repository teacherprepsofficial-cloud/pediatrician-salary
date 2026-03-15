import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1.25rem',
      background: 'linear-gradient(160deg, #f0f5fa 0%, #e4edf5 100%)',
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #d0dde8', boxShadow: '0 8px 40px rgba(30,95,142,0.10)',
        padding: 'clamp(2rem,5vw,3rem)', maxWidth: '480px', width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
          Payment Successful!
        </h1>
        <p style={{ color: '#5a6a7a', fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          Thank you for your purchase. You now have full access to the Pediatrician Salary Database.
        </p>
        <p style={{ color: '#5a6a7a', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Check your email — we sent you a link to set up your account password so you can log in anytime.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/login" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
            Log In to Browse Salaries
          </Link>
          <Link href="/salaries" style={{ color: '#1e5f8e', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
            Browse Salaries Now
          </Link>
        </div>
      </div>
    </div>
  )
}
