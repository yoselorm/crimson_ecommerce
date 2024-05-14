const express = require('express')
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const profileRouter = express.Router();


profileRouter.get('/profile',getProfile);
profileRouter.put('/profile',updateProfile)


module.exports = profileRouter  