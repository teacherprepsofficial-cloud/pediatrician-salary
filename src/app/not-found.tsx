import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ maxWidth: '560px', margin: '5rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.75rem' }}>
        Page not found
      </h1>
      <p style={{ color: '#5a6a7a', marginBottom: '2rem' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn btn-secondary">
        Back to Home
      </Link>
    </div>
  )
}
