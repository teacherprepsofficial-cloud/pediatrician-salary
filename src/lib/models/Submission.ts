import mongoose, { Schema } from 'mongoose'

const SubmissionSchema = new Schema({
  hospitalName:            { type: String, required: true },
  city:                    { type: String, required: true },
  state:                   { type: String, required: true },
  rating:                  { type: Number, required: true },
  specialty:               { type: String, required: true },
  careerStage:             { type: String, required: true },
  annualBaseSalary:        { type: Number, required: true },
  receivedSignOnBonus:     { type: String, required: true },
  signOnBonusAmount:       { type: Number, default: null },
  productivityBonus:       { type: String, required: true },
  hasMoonlighting:         { type: String, required: true },
  moonlightingIncome:      { type: Number, default: null },
  fteStatus:               { type: String, required: true },
  avgClinicalHoursPerWeek: { type: Number, default: null },
  callFrequency:           { type: String, default: '' },
  yearsInRole:             { type: String, required: true },
  pslfEligible:            { type: String, default: '' },
  practiceSetting:         { type: String, required: true },
  housingStipend:          { type: String, default: '' },
  programUnionized:        { type: String, default: '' },
  additionalComments:      { type: String, default: '' },
  submitterEmail:          { type: String, default: '' },
  status:                  { type: String, default: 'pending' }, // pending | approved | rejected
  submittedAt:             { type: Date, default: Date.now },
})

export const Submission = mongoose.models.PediatricianSubmission ||
  mongoose.model('PediatricianSubmission', SubmissionSchema)
