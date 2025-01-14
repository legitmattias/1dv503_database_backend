// src/router/orders.js
import express from 'express'
import db from '../db.js'

const router = express.Router()

// Checkout and create an order
router.post('/checkout', async (req, res) => {
  const { userid, shipAddress, shipCity, shipZip } = req.body
  try {
    const [result] = await db.query(
      `INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip)
       VALUES (?, NOW(), ?, ?, ?)`
      , [userid, shipAddress, shipCity, shipZip],
    )
    const orderId = result.insertId

    // Move cart items to order details
    await db.query(
      `INSERT INTO odetails (ono, isbn, qty, amount)
       SELECT ?, c.isbn, c.qty, b.price * c.qty
       FROM cart c
       JOIN books b ON c.isbn = b.isbn
       WHERE c.userid = ?`,
      [orderId, userid],
    )

    // Clear the cart
    await db.query('DELETE FROM cart WHERE userid = ?', [userid])

    res.json({ message: 'Order placed successfully', orderId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to checkout' })
  }
})

export default router