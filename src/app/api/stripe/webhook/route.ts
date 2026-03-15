import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { sendAccountSetupEmail } from '@/lib/email'

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

    try {
      await connectDB()
      const paidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      const stripeCustomerId = session.customer as string
      const stripePaymentId = session.payment_intent as string

      const userId = session.metadata?.userId

      if (userId) {
        // Logged-in user — upgrade by ID
        await User.findByIdAndUpdate(userId, { tier: 'paid', paidUntil, stripeCustomerId, stripePaymentId })
      } else {
        // Guest buyer — find or create by email Stripe collected
        const email = session.customer_details?.email?.toLowerCase().trim()
        if (!email) {
          console.error('No email from Stripe guest checkout')
          return NextResponse.json({ received: true })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
          // Existing account — just upgrade
          await User.findByIdAndUpdate(existingUser._id, { tier: 'paid', paidUntil, stripeCustomerId, stripePaymentId })
          // Send setup email if they never set a password
          if (!existingUser.passwordHash) {
            const token = crypto.randomBytes(32).toString('hex')
            const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
            await User.findByIdAndUpdate(existingUser._id, { resetToken: token, resetTokenExpiry: expiry })
            await sendAccountSetupEmail(existingUser.email, token).catch(e => console.error('Setup email failed:', e))
          }
        } else {
          // Brand new guest — create account and send setup email
          const token = crypto.randomBytes(32).toString('hex')
          const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
          await User.create({ email, tier: 'paid', paidUntil, stripeCustomerId, stripePaymentId, resetToken: token, resetTokenExpiry: expiry })
          await sendAccountSetupEmail(email, token).catch(e => console.error('Setup email failed:', e))
        }
      }
    } catch (err) {
      console.error('Failed to upgrade user after payment:', err)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
