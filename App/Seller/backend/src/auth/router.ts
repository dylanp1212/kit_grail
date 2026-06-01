import { Router } from 'express'
import { randomUUID } from 'crypto'
import { AuthService } from './service'

const STATE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 10 * 60 * 1000,
  path: '/',
}

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 60 * 1000,
  path: '/',
}

const authRouter = Router()

authRouter.get('/start/google', (req, res) => {
  const state = randomUUID()
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ??
    `${req.protocol}://${req.get('host')}/api/auth/callback/google`

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  })

  res.cookie('seller_oauth_state', state, STATE_COOKIE_OPTIONS)
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
})

authRouter.get('/callback/google', async (req, res) => {
  const { code, state } = req.query as { code?: string; state?: string }
  const stateCookie = req.cookies?.seller_oauth_state

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return res.redirect('/sell/login')
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI ??
    `${req.protocol}://${req.get('host')}/api/auth/callback/google`

  try {
    const authenticated = await new AuthService().exchangeGoogleSeller(code, redirectUri)
    if (authenticated === 'suspended') return res.redirect('/sell/login?error=suspended')
    if (!authenticated) return res.redirect('/sell/login')
    res.clearCookie('seller_oauth_state', { path: '/' })
    res.cookie('seller_session', authenticated.accessToken, SESSION_COOKIE_OPTIONS)
    res.redirect('/sell/')
  } catch {
    res.redirect('/sell/login')
  }
})

authRouter.get('/me', async (req, res) => {
  const token = req.cookies?.seller_session
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const user = await new AuthService().check(token)
    res.json(user)
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

authRouter.post('/signout', (_req, res) => {
  res.clearCookie('seller_session', { path: '/' })
  res.json({ ok: true })
})

export { authRouter }
