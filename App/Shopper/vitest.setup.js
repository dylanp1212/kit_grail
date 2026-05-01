import { cleanup } from '@testing-library/react'
import { beforeEach, afterEach, vi } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})
