import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE } from '@/lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Salaries page handles its own auth gate — no middleware redirect needed

  return NextResponse.next()
}

export const config = {
  matcher: ['/salaries'],
}
