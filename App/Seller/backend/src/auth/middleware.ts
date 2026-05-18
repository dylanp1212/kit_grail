import { Request, Response, NextFunction } from 'express'
import { AuthService } from './service'

export async function requireSellerAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.seller_session
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  try {
    req.user = await new AuthService().check(token)
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
