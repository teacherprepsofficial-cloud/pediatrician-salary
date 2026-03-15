import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession } from '@/lib/auth'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pediatriciansalary.com'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()

    if (session && (session.tier === 'pro' || session.tier === 'paid')) {
      return NextResponse.json({ error: 'You already have access.' }, { status: 400 })
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      // Pre-fill email if logged in, otherwise Stripe collects it
      ...(session ? { customer_email: session.email } : {}),
      metadata: {
        // userId only set if logged in — webhook uses customer email for guests
        ...(session ? { userId: session.userId } : {}),
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
