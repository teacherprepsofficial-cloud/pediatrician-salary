import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { signToken, cookieOptions, COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      // Use same message to prevent email enumeration
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    if (!user.passwordHash) {
      // Guest account (paid without signup) — must set password first
      return NextResponse.json({ error: 'No password set. Check your email for a link to set up your account, or use Forgot Password.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before logging in. Check your inbox.' }, { status: 403 })
    }

    const token = signToken({
      userId: String(user._id),
      email: user.email,
      tier: user.tier,
      emailVerified: user.emailVerified,
    })

    const res = NextResponse.json({ ok: true, tier: user.tier })
    res.cookies.set(COOKIE, token, cookieOptions())
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
