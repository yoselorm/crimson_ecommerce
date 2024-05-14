const express = require('express')
const {  suspendUser, getAllUsers } = require('../controllers/userController');
const isAdmin = require('../middlewares/adminCheck');
const userRouter = express.Router();


userRouter.get('/users',isAdmin,getAllUsers)
userRouter.put('/users/:id/suspend',isAdmin,suspendUser)


module.exports = userRouter  