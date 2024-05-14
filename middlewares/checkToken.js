const jwt = require('jsonwebtoken')
const BlacklistedToken = require('../models/blacklistedTokenModel')

const checkToken = async (req,res,next) =>{

    const token = req.header('Authorization')
    const blacklistedToken = BlacklistedToken.findOne({token})

    if(blacklistedToken){
        return res.status(201).json({message:'Unauthorized'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(decoded);
        
        req.user = decoded.user;
        next()
    } catch (error) {
        console.error(error.message)
        res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = checkToken;