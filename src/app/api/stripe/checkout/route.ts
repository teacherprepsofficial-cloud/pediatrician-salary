import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pediatriciansalary.com'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()

    let userId: string
    let customerEmail: string

    if (session) {
      // Logged-in user
      if (session.tier === 'pro' || session.tier === 'paid') {
        return NextResponse.json({ error: 'You already have access.' }, { status: 400 })
      }
      userId = session.userId
      customerEmail = session.email
    } else {
      // Guest checkout — requires email in body
      const body = await req.json().catch(() => ({}))
      const email = (body.email || '').trim().toLowerCase()

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
      }

      await connectDB()

      // Find or create a minimal account for this email
      let user = await User.findOne({ email })
      if (user) {
        if (user.tier === 'pro' || user.tier === 'paid') {
          return NextResponse.json({ error: 'An account with that email already has access. Please log in.' }, { status: 400 })
        }
      } else {
        user = await User.create({ email, passwordHash: null, tier: 'none', emailVerified: false })
      }

      userId = String(user._id)
      customerEmail = email
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        userId,
      },
      success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 })
  }
}
