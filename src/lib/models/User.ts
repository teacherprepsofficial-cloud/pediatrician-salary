import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  tier: 'none' | 'pro' | 'paid'
  emailVerified: boolean
  emailVerifyToken: string | null
  emailVerifyExpiry: Date | null
  resetToken: string | null
  resetTokenExpiry: Date | null
  submissionId: mongoose.Types.ObjectId | null
  paidUntil: Date | null
  stripeCustomerId: string | null
  stripePaymentId: string | null
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  tier: { type: String, enum: ['none', 'pro', 'paid'], default: 'none' },
  emailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String, default: null },
  emailVerifyExpiry: { type: Date, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  submissionId: { type: Schema.Types.ObjectId, ref: 'Submission', default: null },
  paidUntil: { type: Date, default: null },
  stripeCustomerId: { type: String, default: null },
  stripePaymentId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
