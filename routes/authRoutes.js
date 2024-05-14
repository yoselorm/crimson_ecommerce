const express = require('express')
const { register, login, logout, revokeToken,  sendResetPasswordEmail, updatePassword } = require('../controllers/authController');
const checkToken = require('../middlewares/checkToken');
const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = express.Router();


authRouter.post('/register',register);
authRouter.post('/login', login)
authRouter.post('/revoke-token',revokeToken)
authRouter.post('/logout',logout)
authRouter.post('/update-password/:id',authMiddleware,updatePassword)
authRouter.post('/forgot-password',sendResetPasswordEmail)


module.exports = authRouter