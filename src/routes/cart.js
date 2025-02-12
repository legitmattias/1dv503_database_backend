import express from 'express'
import db from '../config/db.js'
import { validateSession } from '../middleware/auth.js'

const router = express.Router()

// Validate session cookie for all routes.
router.use(validateSession)

// GET: Retrieve all items in the logged-in user’s cart.
router.get('/', async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT c.isbn, c.qty, b.title, b.price, (c.qty * b.price) AS total
       FROM cart c
       JOIN books b ON c.isbn = b.isbn
       WHERE c.userid = ?`,
      [req.userid],
    )
    console.log(`Retrieving cart with items: ${cartItems}`)
    res.json(cartItems)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch cart items' })
  }
})

// POST: Add a book to the cart.
router.post('/', async (req, res) => {
  const { isbn, qty } = req.body
  try {
    await db.query(
      `INSERT INTO cart (userid, isbn, qty)
       VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + ?`,
      [req.userid, isbn, qty, qty],
    )
    console.log(`Book added to cart: ${isbn} - Quantity: ${qty}`)
    res.json({ message: 'Book added to cart' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
})

//  DELETE: Remove a book from the cart
router.delete('/', async (req, res) => {
  const { isbn } = req.body
  try {
    const [result] = await db.query(
      'DELETE FROM cart WHERE userid = ? AND isbn = ?',
      [req.userid, isbn],
    )

    if (result.affectedRows > 0) {
      console.log(`Removed book from cart: ${isbn}`)
      res.json({ message: 'Book removed from cart' })
    } else {
      res.status(404).json({ error: 'Book not found in cart' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to remove book from cart' })
  }
})

export default router
