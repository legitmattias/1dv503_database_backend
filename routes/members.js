// src/router/members.js
import express from 'express'
import db from '../db.js'

const router = express.Router()

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
    res.status(500).json({ error: 'Failed to register member' })
  }
})

export default router