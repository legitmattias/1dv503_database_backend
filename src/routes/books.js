// src/routes/books.js
import express from 'express'
import db from '../config/db.js'

const router = express.Router()

// Get all books
router.get('/', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM books')
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch books' })
  }
})

export default router