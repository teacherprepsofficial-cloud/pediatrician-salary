import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Subscriber } from '@/lib/models/Subscriber'
import { rateLimit, getIP } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = getIP(request)
    const { allowed } = rateLimit(ip, 5, 60 * 60 * 1000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const normalized = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalized) || normalized.length > 254) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    await connectDB()

    const existing = await Subscriber.findOne({ email: normalized })
    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json({ message: 'You are already subscribed.' })
      }
      existing.status = 'active'
      await existing.save()
      return NextResponse.json({ message: 'You have been resubscribed.' })
    }

    await Subscriber.create({ email: normalized })
    return NextResponse.json({ message: 'Subscribed successfully!' })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
