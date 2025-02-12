// src/app.js
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import { dbConfig, serverConfig } from './config/config.js'
import db from './config/db.js'

try {
  db.getConnection()
  console.log(`Connected successfully to database '${dbConfig.database}'!`)
} catch {
  console.log('Database connection failed!')
  process.exit(1)
}

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api', router)

app.listen(serverConfig.port, () => {
  console.log(`Server running at http://localhost:${serverConfig.port}`)
})