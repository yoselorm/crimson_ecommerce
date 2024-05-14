const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const BlacklistedToken = require('../models/blacklistedTokenModel')


const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.replace('Bearer ', '');    
    const blacklistedToken = await BlacklistedToken.findOne({token})
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    if(blacklistedToken){
        return res.status(201).json({error:'Unauthorized'})
    }
 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware;