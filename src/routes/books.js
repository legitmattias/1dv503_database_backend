// src/routes/books.js
import express from 'express'
import db from '../config/db.js'
import { validateSession } from '../middleware/auth.js'

const router = express.Router()

// Validate session cookie for all routes.
router.use(validateSession)

// Get all books, with pagination.
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query // Default to page 1, 20 books per page
    const offset = (page - 1) * limit

    const [books] = await db.query(
      'SELECT * FROM books LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)],
    )

    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM books')

    res.json({
      books,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch books' })
  }
})

// Browse books by subject with pagination OR return subjects if no name is provided
router.get('/subject', async (req, res) => {
  const { name, page = 1, limit = 2 } = req.query

  if (!name) {
    // If no subject is provided, return a list of all subjects
    try {
      const [subjects] = await db.query('SELECT DISTINCT subject FROM books ORDER BY subject ASC')
      return res.json(subjects.map((row) => row.subject))
    } catch (err) {
      console.error('❌ Failed to fetch subjects:', err)
      return res.status(500).json({ error: 'Failed to fetch subjects' })
    }
  }

  // If subject name is provided, return books from that subject
  try {
    console.log(`📥 Received request: name=${name}, page=${page}, limit=${limit}`)
    const offset = (page - 1) * limit

    const [books] = await db.query(
      'SELECT * FROM books WHERE subject = ? LIMIT ? OFFSET ?',
      [name, parseInt(limit), parseInt(offset)],
    )

    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM books WHERE subject = ?', [name])

    res.json({
      books,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('❌ Database error:', err)
    res.status(500).json({ error: 'Failed to fetch books by subject' })
  }
})

// Search books by author or title with pagination
router.get('/search', async (req, res) => {
  const { author, title, page = 1, limit = 3 } = req.query

  if (!author && !title) {
    return res.status(400).json({ error: 'Either author or title must be provided' })
  }

  if (author && title) {
    return res.status(400).json({ error: 'Provide only author or title, not both' })
  }

  try {
    const query = author
      ? 'SELECT * FROM books WHERE author LIKE ? LIMIT ? OFFSET ?'
      : 'SELECT * FROM books WHERE title LIKE ? LIMIT ? OFFSET ?'

    const param = author ? `%${author}%` : `%${title}%`
    const offset = (page - 1) * limit

    // Get paginated books
    const [books] = await db.query(query, [param, parseInt(limit), parseInt(offset)])

    // Get total book count for pagination
    const countQuery = author
      ? 'SELECT COUNT(*) as total FROM books WHERE author LIKE ?'
      : 'SELECT COUNT(*) as total FROM books WHERE title LIKE ?'
      
    const [[{ total }]] = await db.query(countQuery, [param])

    res.json({
      books,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to search books' })
  }
})

export default router