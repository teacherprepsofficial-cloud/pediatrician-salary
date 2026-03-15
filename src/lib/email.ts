import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }
const FROM = 'PediatricianSalary <noreply@pediatriciansalary.com>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://pediatriciansalary.com'

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${BASE_URL}/verify-email?token=${token}`
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your email — PediatricianSalary.com',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem">
        <h2 style="color:#1a2332;font-size:1.5rem;margin-bottom:0.75rem">Verify your email address</h2>
        <p style="color:#5a6a7a;line-height:1.7;margin-bottom:1.5rem">
          Click the button below to verify your email and activate your account.
          This link expires in 24 hours.
        </p>
        <a href="${link}" style="display:inline-block;background:#1e5f8e;color:white;padding:0.75rem 1.75rem;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem">
          Verify Email
        </a>
        <p style="color:#9aa5b0;font-size:0.8rem;margin-top:1.5rem">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${BASE_URL}/reset-password?token=${token}`
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your password — PediatricianSalary.com',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem">
        <h2 style="color:#1a2332;font-size:1.5rem;margin-bottom:0.75rem">Reset your password</h2>
        <p style="color:#5a6a7a;line-height:1.7;margin-bottom:1.5rem">
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <a href="${link}" style="display:inline-block;background:#1e5f8e;color:white;padding:0.75rem 1.75rem;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem">
          Reset Password
        </a>
        <p style="color:#9aa5b0;font-size:0.8rem;margin-top:1.5rem">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

export async function sendApprovalEmail(email: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: 'Your salary submission is live — you now have full access',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem">
        <h2 style="color:#1a2332;font-size:1.5rem;margin-bottom:0.75rem">Your submission has been approved!</h2>
        <p style="color:#5a6a7a;line-height:1.7;margin-bottom:1.5rem">
          Your salary data is now live in the PediatricianSalary.com database. As a verified contributor,
          you have full free access to browse all salary submissions.
        </p>
        <a href="${BASE_URL}/salaries" style="display:inline-block;background:#1e5f8e;color:white;padding:0.75rem 1.75rem;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem">
          Browse Salaries
        </a>
        <p style="color:#9aa5b0;font-size:0.8rem;margin-top:1.5rem">
          Thank you for helping make compensation transparent for pediatricians everywhere.
        </p>
      </div>
    `,
  })
}
