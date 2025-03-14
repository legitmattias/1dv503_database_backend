// src/config/config.js
import dotenv from 'dotenv'
dotenv.config()

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'book_store',
}

export const serverConfig = {
  port: process.env.PORT || 3000,
}