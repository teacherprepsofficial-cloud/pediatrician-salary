import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const normalized = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalized)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email: normalized })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const emailVerifyToken = crypto.randomBytes(32).toString('hex')
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await User.create({
      email: normalized,
      passwordHash,
      emailVerifyToken,
      emailVerifyExpiry,
    })

    await sendVerificationEmail(normalized, emailVerifyToken)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
