import { cleanup } from '@testing-library/react'
import { beforeEach, afterEach, vi } from 'vitest'
import 'dotenv/config'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})
