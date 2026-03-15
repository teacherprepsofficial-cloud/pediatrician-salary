import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'

export async function GET() {
  try {
    await connectDB()
    const salaries = await Submission.find({ status: 'approved' }).sort({ submittedAt: -1 }).lean()
    return NextResponse.json({ salaries })
  } catch {
    return NextResponse.json({ error: 'Failed to load salaries.' }, { status: 500 })
  }
}
