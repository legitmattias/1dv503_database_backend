// src/routes/cart.js
import express from 'express'
import db from '../config/db.js'
import { validateSession } from '../middleware/auth.js'

const router = express.Router()

// Validate session cookie for all routes.
router.use(validateSession)

// Add a book to the cart.
router.post('/', async (req, res) => {
  const { isbn, qty } = req.body
  try {
    await db.query(
      `INSERT INTO cart (userid, isbn, qty)
       VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + ?`,
      [req.userid, isbn, qty, qty],
    )
    res.json({ message: 'Book added to cart' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
})

// Get all items in the logged-in user’s cart.
router.get('/', async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT c.isbn, c.qty, b.title, b.price, (c.qty * b.price) AS total
       FROM cart c
       JOIN books b ON c.isbn = b.isbn
       WHERE c.userid = ?`,
      [req.userid],
    )
    res.json(cartItems)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch cart items' })
  }
})

export default router
