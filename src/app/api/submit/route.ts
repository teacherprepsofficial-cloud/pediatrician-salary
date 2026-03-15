import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Submission } from '@/lib/models/Submission'
import { Subscriber } from '@/lib/models/Subscriber'
import { rateLimit, getIP } from '@/lib/rate-limit'
import { sanitize } from '@/lib/sanitize'

const PROFANITY = [
  'fuck', 'shit', 'bitch', 'nigger', 'nigga', 'cunt', 'faggot', 'fag', 'asshole',
  'bastard', 'prick', 'whore', 'slut', 'dick', 'cock', 'pussy', 'twat', 'retard',
]

function hasProfanity(text: string): boolean {
  const lower = text.toLowerCase()
  return PROFANITY.some(w => new RegExp(`\\b${w}\\b`).test(lower))
}

export async function POST(request: Request) {
  try {
    const ip = getIP(request)
    const { allowed } = rateLimit(ip, 5, 60 * 60 * 1000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
    }

    const data = await request.json()

    // Honeypot
    if (data.website) {
      return NextResponse.json({ message: 'Submission received' })
    }

    // Required fields
    if (!data.hospitalName?.trim() || !data.city?.trim() || !data.state || !data.rating ||
        !data.specialty || !data.careerStage || !data.annualBaseSalary?.trim() ||
        !data.receivedSignOnBonus || !data.productivityBonus || !data.hasMoonlighting ||
        !data.fteStatus || !data.yearsInRole || !data.practiceSetting) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    // Salary validation — strip $ and commas before parsing
    const salaryRaw = String(data.annualBaseSalary).replace(/[$,]/g, '')
    const salary = parseInt(salaryRaw) || 0
    if (salary < 1000 || salary > 2000000) {
      return NextResponse.json({ error: 'Annual salary must be between $1,000 and $2,000,000.' }, { status: 400 })
    }

    // Rating validation
    const rating = parseInt(data.rating) || 0
    if (rating < 1 || rating > 10) {
      return NextResponse.json({ error: 'Rating must be between 1 and 10.' }, { status: 400 })
    }

    // String length limits
    if (String(data.hospitalName).length > 200) {
      return NextResponse.json({ error: 'Hospital name must be under 200 characters.' }, { status: 400 })
    }
    if (data.additionalComments && String(data.additionalComments).length > 5000) {
      return NextResponse.json({ error: 'Comments must be under 5,000 characters.' }, { status: 400 })
    }

    // Profanity check
    const textFields = ['hospitalName', 'city', 'additionalComments', 'signOnBonusAmount', 'moonlightingIncome']
    for (const field of textFields) {
      if (data[field] && hasProfanity(String(data[field]))) {
        return NextResponse.json({ error: 'Please remove inappropriate language from your submission.' }, { status: 400 })
      }
    }

    await connectDB()

    await Submission.create({
      hospitalName:            sanitize(data.hospitalName).slice(0, 200),
      city:                    sanitize(data.city).slice(0, 100),
      state:                   sanitize(data.state).slice(0, 50),
      rating:                  rating,
      specialty:               sanitize(data.specialty).slice(0, 200),
      careerStage:             sanitize(data.careerStage).slice(0, 50),
      annualBaseSalary:        salary,
      receivedSignOnBonus:     sanitize(data.receivedSignOnBonus).slice(0, 10),
      signOnBonusAmount:       data.signOnBonusAmount ? (parseInt(String(data.signOnBonusAmount).replace(/[$,]/g, '')) || null) : null,
      productivityBonus:       sanitize(data.productivityBonus).slice(0, 50),
      hasMoonlighting:         sanitize(data.hasMoonlighting).slice(0, 10),
      moonlightingIncome:      data.moonlightingIncome ? (parseInt(String(data.moonlightingIncome).replace(/[$,]/g, '')) || null) : null,
      fteStatus:               sanitize(data.fteStatus).slice(0, 50),
      avgClinicalHoursPerWeek: data.avgClinicalHoursPerWeek ? (parseInt(String(data.avgClinicalHoursPerWeek)) || null) : null,
      callFrequency:           sanitize(data.callFrequency || '').slice(0, 100),
      yearsInRole:             sanitize(data.yearsInRole).slice(0, 20),
      pslfEligible:            sanitize(data.pslfEligible || '').slice(0, 20),
      practiceSetting:         sanitize(data.practiceSetting).slice(0, 100),
      housingStipend:          sanitize(data.housingStipend || '').slice(0, 10),
      programUnionized:        sanitize(data.programUnionized || '').slice(0, 10),
      additionalComments:      sanitize(data.additionalComments || '').slice(0, 5000),
      submitterEmail:          sanitize(data.submitterEmail || '').slice(0, 254).toLowerCase(),
      status:                  'pending',
    })

    // Also add to subscriber list if email provided
    if (data.submitterEmail) {
      const normalized = String(data.submitterEmail).toLowerCase().trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(normalized)) {
        const existing = await Subscriber.findOne({ email: normalized })
        if (!existing) await Subscriber.create({ email: normalized })
      }
    }

    return NextResponse.json({ message: 'Submission received' })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
