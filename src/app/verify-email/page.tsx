'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      router.push(`/api/auth/verify-email?token=${token}`)
    } else {
      router.push('/login?error=invalid-token')
    }
  }, [token, router])

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a7a' }}>
      Verifying your email…
    </div>
  )
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyRedirect /></Suspense>
}
