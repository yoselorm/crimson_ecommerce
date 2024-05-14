const mongoose = require('mongoose')

const blacklistedTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true
    },
},{timestamps:true})

const blacklistedToken = mongoose.model('BlacklistedToken',blacklistedTokenSchema)

module.exports = blacklistedToken;