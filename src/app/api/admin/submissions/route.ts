import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'

function isAuthorized(request: Request): boolean {
  const secret = request.headers.get('x-admin-secret')
  return secret === process.env.ADMIN_SECRET
}

// GET /api/admin/submissions?status=pending|approved|rejected|all
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'pending'
  const query = status === 'all' ? {} : { status }
  const submissions = await Submission.find(query).sort({ submittedAt: -1 }).lean()
  return NextResponse.json({ submissions })
}
