import dotenv from 'dotenv'
dotenv.config()

import app from './app'

const port = 3010

app.listen(port, () => {
  console.log(`AuthService listening on port ${String(port)}`)
  console.log(`API docs: http://localhost:${String(port)}/api/v0/docs`)
})
