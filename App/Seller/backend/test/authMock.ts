import { vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'

export const requireSellerAuth = vi.fn(
    (_req: Request, _res: Response, next: NextFunction) => {
      _req.user = {
        id: 'test-seller-id',
        email: 'test@example.com',
        name: 'Test Seller',
        role: 'seller',
      }
      next()
    },
)

vi.mock('../src/auth/middleware', () => ({requireSellerAuth}))
