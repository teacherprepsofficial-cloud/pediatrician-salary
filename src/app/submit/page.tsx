'use client'

import { useState } from 'react'

// ── Constants ────────────────────────────────────────────────────────────────

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.',
]

const SPECIALTIES = [
  'Academic General Pediatrician',
  'Adolescent Medicine Specialist',
  'Child Abuse Pediatrician',
  'Child and Adolescent Psychiatrist',
  'Child Neurologist',
  'Clinical Informatics Specialist (Pediatric)',
  'Developmental-Behavioral Pediatrician',
  'General Pediatrician',
  'Neonatologist',
  'Neurodevelopmental Disabilities Pediatrician',
  'Pediatric Allergist / Immunologist',
  'Pediatric Anesthesiologist',
  'Pediatric Cardiologist',
  'Pediatric Cardiothoracic Surgeon',
  'Pediatric Critical Care Specialist (Intensivist)',
  'Pediatric Dermatologist',
  'Pediatric Emergency Medicine Physician',
  'Pediatric Endocrinologist',
  'Pediatric Gastroenterologist',
  'Pediatric General Surgeon',
  'Pediatric Hematologist-Oncologist',
  'Pediatric Hospitalist',
  'Pediatric Infectious Diseases Specialist',
  'Pediatric Medical Geneticist',
  'Pediatric Medical Toxicologist',
  'Pediatric Nephrologist',
  'Pediatric Neurosurgeon',
  'Pediatric Ophthalmologist',
  'Pediatric Orthopedic Surgeon',
  'Pediatric Otolaryngologist (ENT)',
  'Pediatric Pain Medicine Specialist',
  'Pediatric Palliative Care Specialist',
  'Pediatric Pathologist',
  'Pediatric Physiatrist (Rehabilitation Medicine)',
  'Pediatric Plastic Surgeon',
  'Pediatric Pulmonologist',
  'Pediatric Radiologist',
  'Pediatric Rheumatologist',
  'Pediatric Sleep Medicine Specialist',
  'Pediatric Sports Medicine Specialist',
  'Pediatric Transplant Hepatologist',
  'Pediatric Urgent Care Physician',
  'Pediatric Urologist',
]

const YEARS_IN_ROLE = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10 - 15', '16 - 20', '20+']

// ⚠️  TODO: Replace these with the actual Practice Setting options from your Google Form screenshot
const PRACTICE_SETTINGS = [
  'Academic Medical Center / Children\'s Hospital',
  'Community Hospital',
  'Private Practice (Solo)',
  'Private Practice (Group)',
  'Federally Qualified Health Center (FQHC)',
  'Urgent Care / Retail Clinic',
  'Telehealth',
  'Other',
]

const SECTIONS = [
  'Demographics & Location',
  'Specialty & Role',
  'Compensation',
  'Workload & "Real Hourly Rate" Context',
  'Financial Environment',
  'Conclusion',
]

// ── Form state type ───────────────────────────────────────────────────────────

type FormData = {
  // Section 1
  hospitalName: string
  city: string
  state: string
  rating: string
  // Section 2
  specialty: string
  careerStage: string
  // Section 3
  annualBaseSalary: string
  receivedSignOnBonus: string
  signOnBonusAmount: string
  productivityBonus: string
  hasMoonlighting: string
  moonlightingIncome: string
  // Section 4
  fteStatus: string
  avgClinicalHoursPerWeek: string
  callFrequency: string
  yearsInRole: string
  // Section 5
  pslfEligible: string
  practiceSetting: string
  housingStipend: string
  programUnionized: string
  // Section 6
  additionalComments: string
  submitterEmail: string
  // honeypot
  website: string
}

const INITIAL: FormData = {
  hospitalName: '',
  city: '',
  state: '',
  rating: '',
  specialty: '',
  careerStage: '',
  annualBaseSalary: '',
  receivedSignOnBonus: '',
  signOnBonusAmount: '',
  productivityBonus: '',
  hasMoonlighting: '',
  moonlightingIncome: '',
  fteStatus: '',
  avgClinicalHoursPerWeek: '',
  callFrequency: '',
  yearsInRole: '',
  pslfEligible: '',
  practiceSetting: '',
  housingStipend: '',
  programUnionized: '',
  additionalComments: '',
  submitterEmail: '',
  website: '',
}

// ── StarRating ────────────────────────────────────────────────────────────────

function StarRating({ value, onChange, hasError }: { value: string; onChange: (v: string) => void; hasError?: boolean }) {
  const [hovered, setHovered] = useState(0)
  const selected = parseInt(value) || 0
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(String(n))}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem',
              fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
              color: n <= (hovered || selected) ? '#B8860B' : hasError ? '#fca5a5' : '#d0dde8',
              transition: 'color 0.1s ease',
              lineHeight: 1,
            }}
            aria-label={`Rate ${n}`}
          >
            ★
          </button>
        ))}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#5a6a7a', marginTop: '0.5rem' }}>
        1 = Worst · 10 = Best{selected > 0 && <span style={{ marginLeft: '0.75rem', fontWeight: 600, color: '#B8860B' }}>{selected} / 10</span>}
      </div>
    </div>
  )
}

// ── SelectInput ───────────────────────────────────────────────────────────────

function SelectInput({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  hasError,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hasError?: boolean
  searchable?: boolean
}) {
  return (
    <select
      className={`form-input${hasError ? ' error' : ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ cursor: 'pointer' }}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}

// ── MoneyInput ────────────────────────────────────────────────────────────────

function MoneyInput({ value, onChange, className, hasError }: {
  value: string
  onChange: (v: string) => void
  className?: string
  hasError?: boolean
}) {
  const display = value ? Number(value).toLocaleString() : ''
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
        color: '#5a6a7a', fontWeight: 600, fontSize: '1rem', pointerEvents: 'none', zIndex: 1,
      }}>$</span>
      <input
        type="text"
        inputMode="numeric"
        className={`form-input${hasError ? ' error' : ''}${className ? ' ' + className : ''}`}
        placeholder="0"
        value={display}
        style={{ paddingLeft: '2rem' }}
        onChange={e => {
          const raw = e.target.value.replace(/[^0-9]/g, '')
          onChange(raw)
        }}
      />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubmitPage() {
  const [step, setStep] = useState(0) // 0-indexed
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const totalSteps = SECTIONS.length
  const progress = ((step + 1) / totalSteps) * 100

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function validateStep(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}

    if (step === 0) {
      if (!form.hospitalName.trim()) e.hospitalName = 'Required'
      if (!form.city.trim()) e.city = 'Required'
      if (!form.state) e.state = 'Required'
      if (!form.rating) e.rating = 'Required'
    }

    if (step === 1) {
      if (!form.specialty) e.specialty = 'Required'
      if (!form.careerStage) e.careerStage = 'Required'
    }

    if (step === 2) {
      if (!form.annualBaseSalary.trim()) e.annualBaseSalary = 'Required'
      if (!form.receivedSignOnBonus) e.receivedSignOnBonus = 'Required'
      if (!form.productivityBonus) e.productivityBonus = 'Required'
      if (!form.hasMoonlighting) e.hasMoonlighting = 'Required'
    }

    if (step === 3) {
      if (!form.fteStatus) e.fteStatus = 'Required'
      if (!form.yearsInRole) e.yearsInRole = 'Required'
    }

    if (step === 4) {
      if (!form.practiceSetting) e.practiceSetting = 'Required'
    }

    if (step === 5) {
      if (!form.submitterEmail.trim()) e.submitterEmail = 'Email is required to receive access to the salary database.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail)) e.submitterEmail = 'Please enter a valid email address.'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, totalSteps - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function back() {
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    if (!validateStep()) return
    setSubmitting(true)
    setServerError('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setServerError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  if (submitted) return <SuccessScreen />

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
      {/* Page title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#1a2332', letterSpacing: '-0.01em' }}>
          Pediatrician Salary Database
        </h1>
        <p style={{ color: '#5a6a7a', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          All submissions are anonymous, reviewed before publishing, and provide complete access to the salary database upon approval.
        </p>
        <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 500 }}>
          * Indicates required question
        </p>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#5a6a7a', fontWeight: 500 }}>
            Page {step + 1} of {totalSteps}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#1e5f8e', fontWeight: 600 }}>
            {SECTIONS[step]}
          </span>
        </div>
      </div>

      {/* Section header */}
      <div className="section-header" style={{ marginBottom: 0 }}>
        Section {step + 1}: {SECTIONS[step]}
      </div>

      {/* Form body */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #d0dde8',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>

        {/* Honeypot — hidden from humans */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={e => set('website', e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {step === 0 && <Step1 form={form} errors={errors} set={set} />}
        {step === 1 && <Step2 form={form} errors={errors} set={set} />}
        {step === 2 && <Step3 form={form} errors={errors} set={set} />}
        {step === 3 && <Step4 form={form} errors={errors} set={set} />}
        {step === 4 && <Step5 form={form} errors={errors} set={set} />}
        {step === 5 && <Step6 form={form} errors={errors} set={set} />}
      </div>

      {serverError && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '0.875rem 1rem',
          color: '#dc2626',
          fontSize: '0.9rem',
          marginBottom: '1rem',
        }}>
          {serverError}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {step > 0 && (
          <button onClick={back} className="btn btn-ghost" style={{ padding: '0.625rem 1.25rem' }}>
            Back
          </button>
        )}
        {step < totalSteps - 1 ? (
          <button onClick={next} className="btn btn-secondary" style={{ padding: '0.625rem 1.5rem' }}>
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.625rem 1.75rem', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        )}
        <button
          onClick={() => {
            setForm(INITIAL)
            setStep(0)
            setErrors({})
          }}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1e5f8e', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          Clear form
        </button>
      </div>
    </div>
  )
}

// ── Step components ───────────────────────────────────────────────────────────

type StepProps = {
  form: FormData
  errors: Partial<Record<keyof FormData, string>>
  set: (field: keyof FormData, value: string) => void
}

function Step1({ form, errors, set }: StepProps) {
  return (
    <>
      <FormField label="Name of Hospital / Institution" required error={errors.hospitalName}>
        <input
          type="text"
          className={`form-input${errors.hospitalName ? ' error' : ''}`}
          placeholder="Your answer"
          value={form.hospitalName}
          onChange={e => set('hospitalName', e.target.value)}
        />
      </FormField>

      <FormField label="City" required error={errors.city}>
        <input
          type="text"
          className={`form-input${errors.city ? ' error' : ''}`}
          placeholder="Your answer"
          value={form.city}
          onChange={e => set('city', e.target.value)}
        />
      </FormField>

      <FormField label="State" required error={errors.state}>
        <SelectInput
          options={US_STATES}
          value={form.state}
          onChange={v => set('state', v)}
          searchable
          hasError={!!errors.state}
        />
      </FormField>

      <FormField label="Rating of working at this hospital" required error={errors.rating}>
        <StarRating value={form.rating} onChange={v => set('rating', v)} hasError={!!errors.rating} />
      </FormField>
    </>
  )
}

function Step2({ form, errors, set }: StepProps) {
  return (
    <>
      <FormField label="Pediatrician Position / Specialty" required error={errors.specialty}>
        <SelectInput
          options={SPECIALTIES}
          value={form.specialty}
          onChange={v => set('specialty', v)}
          searchable
          hasError={!!errors.specialty}
        />
      </FormField>

      <FormField label="Current Career Stage" required error={errors.careerStage}>
        <SelectInput
          options={['Resident', 'Fellow', 'Attending']}
          value={form.careerStage}
          onChange={v => set('careerStage', v)}
          hasError={!!errors.careerStage}
        />
      </FormField>
    </>
  )
}

function Step3({ form, errors, set }: StepProps) {
  return (
    <>
      <FormField label="Annual Base Salary/Stipend" required error={errors.annualBaseSalary}>
        <MoneyInput
          value={form.annualBaseSalary}
          onChange={v => set('annualBaseSalary', v)}
          hasError={!!errors.annualBaseSalary}
        />
      </FormField>

      <FormField label="Did you receive a Sign-on or Relocation Bonus?" required error={errors.receivedSignOnBonus}>
        <SelectInput
          options={['Yes', 'No']}
          value={form.receivedSignOnBonus}
          onChange={v => set('receivedSignOnBonus', v)}
          hasError={!!errors.receivedSignOnBonus}
        />
      </FormField>

      <FormField label="If Yes: How much?">
        <MoneyInput
          value={form.signOnBonusAmount}
          onChange={v => set('signOnBonusAmount', v)}
        />
      </FormField>

      <FormField label="Are you eligible for Productivity or Incentive Bonuses?" required error={errors.productivityBonus}>
        <SelectInput
          options={['Yes - RVU based', 'Yes - Quality based', 'No']}
          value={form.productivityBonus}
          onChange={v => set('productivityBonus', v)}
          hasError={!!errors.productivityBonus}
        />
      </FormField>

      <FormField label="Do you have Moonlighting or Side-gig income options?" required error={errors.hasMoonlighting}>
        <SelectInput
          options={['Yes', 'No']}
          value={form.hasMoonlighting}
          onChange={v => set('hasMoonlighting', v)}
          hasError={!!errors.hasMoonlighting}
        />
      </FormField>

      <FormField label="If Yes: Approximate annual moonlighting income?">
        <MoneyInput
          value={form.moonlightingIncome}
          onChange={v => set('moonlightingIncome', v)}
        />
      </FormField>
    </>
  )
}

function Step4({ form, errors, set }: StepProps) {
  return (
    <>
      <FormField label="FTE Status" required error={errors.fteStatus}>
        <SelectInput
          options={['1.0 Full Time', '<1.0 Part Time']}
          value={form.fteStatus}
          onChange={v => set('fteStatus', v)}
          hasError={!!errors.fteStatus}
        />
      </FormField>

      <FormField label="Average Clinical Hours Per Week">
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="120"
          className="form-input"
          placeholder="e.g. 40"
          value={form.avgClinicalHoursPerWeek}
          onChange={e => set('avgClinicalHoursPerWeek', e.target.value.replace(/[^0-9]/g, ''))}
        />
      </FormField>

      <FormField label="Call Frequency" hint="e.g. 1 in 4 weekends, every 3rd night, no call">
        <input
          type="text"
          className="form-input"
          placeholder="e.g. 1 in 4 weekends"
          value={form.callFrequency}
          onChange={e => set('callFrequency', e.target.value)}
        />
      </FormField>

      <FormField label="Total Years Working in this Role" required error={errors.yearsInRole}>
        <SelectInput
          options={YEARS_IN_ROLE}
          value={form.yearsInRole}
          onChange={v => set('yearsInRole', v)}
          hasError={!!errors.yearsInRole}
        />
      </FormField>
    </>
  )
}

function Step5({ form, errors, set }: StepProps) {
  return (
    <>
      <FormField label="Is this position PSLF Eligible?">
        <SelectInput
          options={['Yes', 'No', 'Unsure']}
          value={form.pslfEligible}
          onChange={v => set('pslfEligible', v)}
        />
      </FormField>

      <FormField label="Practice Setting" required error={errors.practiceSetting}>
        <SelectInput
          options={PRACTICE_SETTINGS}
          value={form.practiceSetting}
          onChange={v => set('practiceSetting', v)}
          hasError={!!errors.practiceSetting}
        />
      </FormField>

      <FormField label="(For Residents/Fellows Only) Do you receive a Housing Stipend?">
        <SelectInput
          options={['Yes', 'No']}
          value={form.housingStipend}
          onChange={v => set('housingStipend', v)}
        />
      </FormField>

      <FormField label="(For Residents/Fellows Only) Is your program Unionized?">
        <SelectInput
          options={['Yes', 'No']}
          value={form.programUnionized}
          onChange={v => set('programUnionized', v)}
        />
      </FormField>
    </>
  )
}

function Step6({ form, errors: _errors, set }: StepProps) {
  return (
    <>
      <FormField label="Additional Comments">
        <textarea
          className="form-textarea"
          placeholder="Anything else you'd like to share about your compensation or work environment?"
          value={form.additionalComments}
          onChange={e => set('additionalComments', e.target.value)}
          rows={4}
        />
      </FormField>

      <div style={{
        backgroundColor: '#f0f5fa',
        borderRadius: '10px',
        padding: '1.25rem',
        border: `1px solid ${_errors.submitterEmail ? '#fca5a5' : '#d0dde8'}`,
      }}>
        <FormField
          label="Your Email Address"
          required
          error={_errors.submitterEmail}
          hint="Your email is required to receive access to the full salary database once your submission is approved. It is never shared or made public."
        >
          <input
            type="email"
            className={`form-input${_errors.submitterEmail ? ' error' : ''}`}
            placeholder="your@email.com"
            value={form.submitterEmail}
            onChange={e => set('submitterEmail', e.target.value)}
          />
        </FormField>
        <p style={{ fontSize: '0.8rem', color: '#5a6a7a', marginTop: '0.75rem' }}>
          Once approved, you&apos;ll receive an email with a link to set up your free account and browse the full salary database — no separate sign-up needed.
        </p>
      </div>
    </>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontWeight: 600,
        fontSize: '0.975rem',
        color: '#1a2332',
        marginBottom: hint ? '0.25rem' : '0.75rem',
      }}>
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: '0.25rem' }}>*</span>}
      </label>
      {hint && (
        <p style={{ fontSize: '0.82rem', color: '#5a6a7a', marginBottom: '0.75rem' }}>{hint}</p>
      )}
      {children}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          marginTop: '0.5rem',
          color: '#dc2626',
          fontSize: '0.85rem',
        }}>
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  )
}

function SuccessScreen() {
  return (
    <div style={{ maxWidth: '560px', margin: '4rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a2332', marginBottom: '0.75rem' }}>
        Thank you for submitting!
      </h1>
      <p style={{ color: '#5a6a7a', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Your salary data has been received and will be reviewed before being added to the database.
        Every submission helps pediatricians across the country negotiate better compensation.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/salaries" className="btn btn-secondary">Browse Salaries</a>
        <a href="/" className="btn btn-ghost">Back to Home</a>
      </div>
    </div>
  )
}
