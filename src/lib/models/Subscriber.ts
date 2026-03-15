import mongoose, { Schema } from 'mongoose'

const SubscriberSchema = new Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  status:    { type: String, default: 'active' }, // active | unsubscribed
  createdAt: { type: Date, default: Date.now },
})

export const Subscriber = mongoose.models.PediatricianSubscriber ||
  mongoose.model('PediatricianSubscriber', SubscriberSchema)
