// src/app.js
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './router/index.js'
import { serverConfig } from './config.js'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/api', router)

app.listen(serverConfig.port, () => {
  console.log(`Server running at http://localhost:${serverConfig.port}`)
})