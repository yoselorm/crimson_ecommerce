const mongoose = require('mongoose');


const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    fullname: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    }


}, { timestamps: true })


const User = mongoose.model("User", userSchema)
module.exports = User