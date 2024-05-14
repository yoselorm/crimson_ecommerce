const express = require('express')
const { addOrder, getOrdersByUser, getOrders, updateOrder, cancelOrder } = require('../controllers/orderController')
const isAdmin = require('../middlewares/adminCheck')

const orderRouter = express.Router()

orderRouter.post('/orders', addOrder);
orderRouter.get('/orders', getOrdersByUser);
orderRouter.get('/orders/admin', isAdmin, getOrders);
orderRouter.put('/orders/admin/:id', isAdmin, updateOrder);
orderRouter.delete('/orders/admin/:id', cancelOrder);

module.exports = orderRouter;