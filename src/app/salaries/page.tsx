import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'
import { SalaryCard } from '@/components/SalaryCard'

async function getApprovedSalaries() {
  try {
    await connectDB()
    return await Submission.find({ status: 'approved' }).sort({ submittedAt: -1 }).lean()
  } catch {
    return []
  }
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
            <SalaryCard key={String(s._id)} s={s} />
          ))}
        </div>
      )}
    </div>
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
