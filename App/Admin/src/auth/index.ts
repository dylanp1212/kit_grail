export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'administrator'
}

export interface Authenticated {
  name: string
  accessToken: string
}
