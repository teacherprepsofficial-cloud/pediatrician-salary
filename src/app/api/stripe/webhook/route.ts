import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const userId = session.metadata?.userId
    if (!userId) {
      console.error('No userId in session metadata')
      return NextResponse.json({ received: true })
    }

    try {
      await connectDB()
      const paidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year

      await User.findByIdAndUpdate(userId, {
        tier: 'paid',
        paidUntil,
        stripeCustomerId: session.customer as string,
        stripePaymentId: session.payment_intent as string,
      })
    } catch (err) {
      console.error('Failed to upgrade user after payment:', err)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
