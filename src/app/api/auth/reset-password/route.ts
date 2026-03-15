import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { signToken, cookieOptions, COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 })
    }

    user.passwordHash = await bcrypt.hash(password, 12)
    user.resetToken = null
    user.resetTokenExpiry = null
    user.emailVerified = true // if they got the email, it's valid
    await user.save()

    const jwt = signToken({
      userId: String(user._id),
      email: user.email,
      tier: user.tier,
      emailVerified: true,
    })

    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE, jwt, cookieOptions())
    return res
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
