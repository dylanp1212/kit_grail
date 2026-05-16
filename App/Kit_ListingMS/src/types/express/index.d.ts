declare global {
  namespace Express {
    export interface Request {
      user?: import('../../auth').AuthSeller
    }
  }
}
