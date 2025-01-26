// src/routes/orders.js
import express from 'express'
import db from '../config/db.js'
import { validateSession } from '../middleware/auth.js'

const router = express.Router()

// Validate session for all routes
router.use(validateSession)

// Checkout and create an order.
router.post('/checkout', async (req, res) => {
  const { userid } = req
  const { shipAddress = 'Default Address', shipCity = 'Default City', shipZip = '00000' } = req.body

  try {
    // Retrieve cart items.
    const [cartItems] = await db.query(
      `SELECT c.isbn, c.qty, b.title, b.price, (c.qty * b.price) AS total
       FROM cart c
       JOIN books b ON c.isbn = b.isbn
       WHERE c.userid = ?`,
      [userid],
    )

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0)

    // Create the order.
    const [result] = await db.query(
      `INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip)
       VALUES (?, NOW(), ?, ?, ?)`,
      [userid, shipAddress, shipCity, shipZip],
    )
    const orderId = result.insertId

    // Move cart items to order details.
    await db.query(
      `INSERT INTO odetails (ono, isbn, qty, amount)
       SELECT ?, c.isbn, c.qty, c.qty * b.price
       FROM cart c
       JOIN books b ON c.isbn = b.isbn
       WHERE c.userid = ?`,
      [orderId, userid],
    )

    // Clear the cart.
    await db.query('DELETE FROM cart WHERE userid = ?', [userid])

    res.json({
      message: 'Checkout successful',
      orderId,
      invoice: {
        items: cartItems,
        totalAmount,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to checkout' })
  }
})

export default router
