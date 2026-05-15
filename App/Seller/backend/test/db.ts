// import { Pool } from 'pg'
// import * as fs from 'fs'

// import dotenv from 'dotenv'
// dotenv.config()
// process.env.POSTGRES_DB = 'test'

// const pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   database: process.env.POSTGRES_DB,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
// })

// const run = async (file: string) => {
//   const content = fs.readFileSync(file, 'utf8')
//   const lines = content.split(/\r?\n/)
//   let statement = ''
//   for (let line of lines) {
//     line = line.trim()
//     // this if-statement requires SQL files to have a comment to be hit
//     // ########       DONT FORGET TO HIT THIS       ########
//     if (!line.startsWith('--')) {
//       statement += ' ' + line + '\n'
//       if (line.endsWith(';')) {
//         await pool.query(statement)
//         statement = ''
//       }
//     }
//   }
// }

// const reset = async () => {
//   await run('../../Shopper/sql/schema.sql')
//   // await run('../../Shopper/sql/test.sql')
// }

// const shutdown = () => {
//   pool.end()
// }

// export { reset, shutdown }