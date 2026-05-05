export interface SessionUser {
  id: string
  email: string
  name: string
}

export interface Authenticated {
  name: string
  accessToken: string
}

export interface GoogleProfile {
  sub: string
  email: string
  name: string
}
