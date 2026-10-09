import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

/** Protects every /admin route. Only /admin/login is public. */
export async function middleware(req: NextRequest) {
  const valid = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)
  const isLogin = req.nextUrl.pathname.startsWith('/admin/login')

  if (isLogin) return valid ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next()
  if (!valid) return NextResponse.redirect(new URL('/admin/login', req.url))

  const res = NextResponse.next()
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export const config = { matcher: ['/admin/:path*'] }
