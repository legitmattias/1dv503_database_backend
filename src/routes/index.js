// src/routes/index.js
import express from 'express'
import booksRouter from './books.js'
import membersRouter from './members.js'
import cartRouter from './cart.js'
import ordersRouter from './orders.js'

const router = express.Router()

router.use('/books', booksRouter)
router.use('/members', membersRouter)
router.use('/cart', cartRouter)
router.use('/orders', ordersRouter)

export default router