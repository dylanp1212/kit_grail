declare namespace Express {
  interface Request {
    user?: import('./auth').AuthSeller
  }
}
