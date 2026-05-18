export interface CreateKeyRequest {
  label: string
}

export interface KeyMetadata {
  id: string
  prefix: string
  label?: string
  created_at?: string
  revoked_at?: string
}

export interface KeyCreated {
  id: string
  prefix: string
  plaintext: string
  label: string
  created_at: string
}
