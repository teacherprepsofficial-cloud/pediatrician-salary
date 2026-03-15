import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { signToken, cookieOptions, COOKIE } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid-token', req.url))
    }

    await connectDB()

    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=expired-token', req.url))
    }

    user.emailVerified = true
    user.emailVerifyToken = null
    user.emailVerifyExpiry = null
    await user.save()

    const jwt = signToken({
      userId: String(user._id),
      email: user.email,
      tier: user.tier,
      emailVerified: true,
    })

    const res = NextResponse.redirect(new URL('/salaries?verified=1', req.url))
    res.cookies.set(COOKIE, jwt, cookieOptions())
    return res
  } catch (err) {
    console.error('Verify email error:', err)
    return NextResponse.redirect(new URL('/login?error=server-error', req.url))
  }
}
