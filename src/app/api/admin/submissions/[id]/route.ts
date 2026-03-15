import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'
import { User } from '@/lib/models/User'
import { sendApprovalEmail, sendAccountSetupEmail } from '@/lib/email'

function isAuthorized(request: Request): boolean {
  const secret = request.headers.get('x-admin-secret')
  return secret === process.env.ADMIN_SECRET
}

// PATCH /api/admin/submissions/[id] — approve or reject
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await connectDB()
  const submission = await Submission.findByIdAndUpdate(id, { status }, { new: true })

  // If approved, upgrade the linked user to 'pro' and send notification
  if (status === 'approved' && submission) {
    const email = submission.submitterEmail?.toLowerCase().trim()

    // Find existing user by submissionId or email
    let user = await User.findOne({ submissionId: submission._id })
    if (!user && email) {
      user = await User.findOne({ email })
    }

    if (user) {
      // Existing account — upgrade to pro
      user.tier = 'pro'
      if (!user.submissionId) user.submissionId = submission._id
      await user.save()
      try { await sendApprovalEmail(user.email) } catch (e) { console.error('Approval email failed:', e) }
    } else if (email) {
      // No account yet — create one and send setup email
      const token = crypto.randomBytes(32).toString('hex')
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const newUser = await User.create({
        email,
        tier: 'pro',
        submissionId: submission._id,
        resetToken: token,
        resetTokenExpiry: expiry,
        emailVerified: false,
      })
      try { await sendAccountSetupEmail(newUser.email, token) } catch (e) { console.error('Setup email failed:', e) }
    }
  }

  return NextResponse.json({ message: `Submission ${status}` })
}
