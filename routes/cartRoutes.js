const express = require('express')
const { addToCart, getCartItems, removeFromCart } = require('../controllers/cartController')

const cartRouter = express.Router()

cartRouter.post('/cart/add',addToCart)
cartRouter.get('/cart',getCartItems)
cartRouter.delete('/cart/remove/:id',removeFromCart)

module.exports = cartRouter