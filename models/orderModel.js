const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

products:[
    {
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required: true
    }
],
totalPrice:{
    type:Number,
    required:true
},
shippingAddress:{
    type:String,
    required:true
},
paymentMethod:{
    type:String,
    enum:['Credit Card','Momo','Cash on delivery'],
    required:true
},
user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required: true
},
status:{
    type:String,
    enum:['Pending','Processing','Shipped','Delivered'],
    default:'Pending'
}


},{timestamps:true})

const Order = mongoose.model('Order',orderSchema)

module.exports = Order