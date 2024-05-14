const express = require('express')
const { addToWishlist, getWishlistItems, removeFromWishlist } = require('../controllers/wishlistController')

const wishlistRouter = express.Router()

wishlistRouter.post('/wishlist',addToWishlist)
wishlistRouter.get('/wishlist',getWishlistItems)
wishlistRouter.delete('/wishlist/remove/:id',removeFromWishlist)

module.exports = wishlistRouter