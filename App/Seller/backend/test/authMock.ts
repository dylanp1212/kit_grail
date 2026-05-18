import { vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../src/auth/middleware', () => ({
  requireSellerAuth: (_req: Request, _res: Response, next: NextFunction) => {
    _req.user = { id: 'test-seller-id', email: 'test@example.com', name: 'Test Seller' }
    next()
  },
}))
