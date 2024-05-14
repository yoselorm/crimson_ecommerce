const mongoose = require('mongoose')

const productSchema = new mongoose.Schema ({
    product_name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image:[{
        img_url:{
            type:String,
            required: true
        },
        public_id:{
            type: String
        }
    }]


},{timestamps:true})


const Product = mongoose.model('Product',productSchema)
module.exports = Product;