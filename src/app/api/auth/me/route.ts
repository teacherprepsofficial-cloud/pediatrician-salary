import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ user: null })
    }

    // Refresh from DB to get latest tier
    await connectDB()
    const user = await User.findById(session.userId).select('-passwordHash -emailVerifyToken -resetToken')
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        userId: String(user._id),
        email: user.email,
        tier: user.tier,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        submissionId: user.submissionId,
      }
    })
  } catch (err) {
    console.error('Me error:', err)
    return NextResponse.json({ user: null })
  }
}
