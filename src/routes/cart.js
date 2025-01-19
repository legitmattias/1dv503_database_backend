// src/routes/cart.js
import express from 'express'
import db from '../config/db.js'

const router = express.Router()

// Add a book to the cart
router.post('/', async (req, res) => {
  const { userid, isbn, qty } = req.body
  try {
    await db.query(
      `INSERT INTO cart (userid, isbn, qty)
       VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + ?`,
      [userid, isbn, qty, qty],
    )
    res.json({ message: 'Book added to cart' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
})

export default router