import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'blx_admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const getKey = () => {
  const s = process.env.ADMIN_SESSION_SECRET
  return s && s.length >= 32 ? new TextEncoder().encode(s) : null
}

export async function createSessionToken() {
  const key = getKey()
  if (!key) throw new Error('ADMIN_SESSION_SECRET is missing or shorter than 32 characters')
  return new SignJWT({ role: 'super_admin' })
    .setProtectedHeader({ alg: 'HS256' }).setSubject('admin').setIssuedAt().setExpirationTime('7d').sign(key)
}

export async function verifySessionToken(token?: string) {
  const key = getKey()
  if (!token || !key) return false
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload.sub === 'admin'
  } catch {
    return false
  }
}
