// src/config/db.js
import mysql from 'mysql2'
import { dbConfig } from './config.js'

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool.promise()
