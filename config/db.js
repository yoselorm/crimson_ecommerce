const mongoose = require('mongoose')
require('dotenv').config();

const mongouri = process.env.MONGOURI

const database = async() =>{
    try {
        await mongoose.connect(mongouri)
        console.log("Database is connected");
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = database