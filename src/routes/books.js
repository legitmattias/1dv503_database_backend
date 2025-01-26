// src/routes/books.js
import express from 'express'
import db from '../config/db.js'
import { validateSession } from '../middleware/auth.js'

const router = express.Router()

// Validate session cookie for all routes.
router.use(validateSession)

// Get all books.
router.get('/', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM books')
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch books' })
  }
})

// Browse books by subject.
router.get('/subject', async (req, res) => {
  const { name } = req.query
  if (!name) {
    return res.status(400).json({ error: 'Subject name is required' })
  }

  try {
    const [books] = await db.query('SELECT * FROM books WHERE subject = ?', [name])
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch books by subject' })
  }
})

// Search books by author or title.
router.get('/search', async (req, res) => {
  const { author, title } = req.query

  if (!author && !title) {
    return res.status(400).json({ error: 'Either author or title must be provided' })
  }

  if (author && title) {
    return res.status(400).json({ error: 'Provide only author or title, not both' })
  }

  try {
    const query = author
      ? 'SELECT * FROM books WHERE author LIKE ?'
      : 'SELECT * FROM books WHERE title LIKE ?'
    const param = author ? `%${author}%` : `%${title}%`

    const [books] = await db.query(query, [param])
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to search books' })
  }
})

export default router