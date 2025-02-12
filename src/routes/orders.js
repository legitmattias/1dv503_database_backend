// src/routes/orders.js
import express from 'express'
import db from '../config/db.js'
import { validateSession } from '../middleware/auth.js'

const router = express.Router()

// Validate session for all routes
router.use(validateSession)

// POST: Checkout and create an order.
router.post('/checkout', async (req, res) => {
  const { userid } = req

  try {
    // Retrieve user's shipping details.
    const [userData] = await db.query(
      `SELECT address AS shipAddress, city AS shipCity, zip AS shipZip 
       FROM members WHERE userid = ?`,
      [userid],
    )

    if (userData.length === 0) {
      return res.status(400).json({ error: 'User not found' })
    }

    const { shipAddress, shipCity, shipZip } = userData[0]

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

// GET: Retrieve order confirmation details by order ID
router.get('/confirmation/:orderId', async (req, res) => {
  const { orderId } = req.params

  try {
    // Retrieve shipping address and order details
    const [orderDetails] = await db.query(
      `SELECT o.ono AS orderId, o.created, 
              m.fname, m.lname, m.address, m.city, m.zip, 
              od.isbn, b.title, b.price, od.qty, 
              (od.qty * b.price) AS total
       FROM orders o
       JOIN members m ON o.userid = m.userid
       JOIN odetails od ON o.ono = od.ono
       JOIN books b ON od.isbn = b.isbn
       WHERE o.ono = ? AND o.userid = ?`,
      [orderId, req.userid],
    )

    if (orderDetails.length === 0) {
      return res.status(404).json({ error: 'Order not found or does not belong to user' })
    }

    // Format response
    const response = {
      orderId: orderDetails[0].orderId,
      created: orderDetails[0].created,
      shippingAddress: {
        name: `${orderDetails[0].fname} ${orderDetails[0].lname}`,
        address: orderDetails[0].address,
        city: orderDetails[0].city,
        zip: orderDetails[0].zip,
      },
      items: orderDetails.map(item => ({
        isbn: item.isbn,
        title: item.title,
        price: item.price,
        qty: item.qty,
        total: item.total,
      })),
      totalAmount: orderDetails.reduce((sum, item) => sum + item.total, 0),
    }

    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to retrieve order confirmation' })
  }
})


export default router
