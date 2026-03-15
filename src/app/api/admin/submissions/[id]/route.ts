import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'
import { User } from '@/lib/models/User'
import { sendApprovalEmail } from '@/lib/email'

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
    const user = await User.findOne({ submissionId: submission._id })
    if (user) {
      user.tier = 'pro'
      await user.save()
      try { await sendApprovalEmail(user.email) } catch (e) { console.error('Approval email failed:', e) }
    } else if (submission.submitterEmail) {
      // Try matching by email in case submission was linked by email
      const userByEmail = await User.findOne({ email: submission.submitterEmail.toLowerCase() })
      if (userByEmail) {
        userByEmail.tier = 'pro'
        if (!userByEmail.submissionId) userByEmail.submissionId = submission._id
        await userByEmail.save()
        try { await sendApprovalEmail(userByEmail.email) } catch (e) { console.error('Approval email failed:', e) }
      }
    }
  }

  return NextResponse.json({ message: `Submission ${status}` })
}
