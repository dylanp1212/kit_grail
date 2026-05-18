export interface SessionUser {
  id: string
  email: string
  name: string
}

export interface Authenticated {
  name: string
  accessToken: string
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser
  }
}
