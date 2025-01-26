// src/routes/members.js
import express from 'express'
import db from '../config/db.js'

const router = express.Router()

// Get members (all or filtered by email)
router.get('/', async (req, res) => {
  const { email } = req.query
  try {
    let query = 'SELECT * FROM members'
    const params = []

    // Filter by email if provided
    if (email) {
      query += ' WHERE email = ?'
      params.push(email)
    }

    const [members] = await db.query(query, params)
    res.json(members)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch members' })
  }
})

// Register a new member
router.post('/register', async (req, res) => {
  const { fname, lname, address, city, zip, phone, email, password } = req.body
  try {
    const [result] = await db.query(
      `INSERT INTO members (fname, lname, address, city, zip, phone, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      , [fname, lname, address, city, zip, phone, email, password],
    )
    res.status(201).json({ message: 'Member registered successfully', memberId: result.insertId })
  } catch (err) {
    console.error(err)
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'A member with this e-mail already exists.' })
    } else {
      res.status(500).json({ error: 'Failed to register member' })
    }
  }
})

// Login a member
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const [users] = await db.query(
      'SELECT * FROM members WHERE email = ? AND password = ?',
      [email, password],
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = users[0]

    // Simulated session token. Not for production.
    const sessionToken = `${user.userid}-${Date.now()}`
    res.json({
      message: 'Login successful',
      sessionToken,
      user: {
        userid: user.userid,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to log in' })
  }
})

export default router