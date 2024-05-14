const Cart = require('../models/cartModel')
const mongoose = require('mongoose')

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const isTrue = mongoose.Types.ObjectId.isValid(productId)
        if(!isTrue){
            throw new Error()
        }
        if (!productId || !quantity) {
            return res.status(400).json({ error: 'productId and quantity are required' });
        }
        //this one I put here to check if the user already doesnt have a cart list or not
        const userId = req.user._id
        const isUserIdTrue = mongoose.Types.ObjectId.isValid(userId)
        if(!isUserIdTrue){
            throw new Error()
        }
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );

        if (existingProductIndex !== -1) {
            // for here adey check if the product exists, if yeah then update its quantity
            cart.products[existingProductIndex].quantity += parseInt(quantity);
        } else {
            // else just add am to the cart
            cart.products.push({ productId, quantity });
        }

        await cart.save();

        res.json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user._id
        const isUserIdTrue = mongoose.Types.ObjectId.isValid(userId)
        if(!isUserIdTrue){
            throw new Error('Invalid user ID')
        }
        //so here I learnt you use the findById is the id is being used as a primary key in your schema but findOne when it
        //is just a sepereate field 
        const cart = await Cart.findOne({userId})
        if (!cart) {
            return res.status(404).json({ error: 'Empty cart' });
          }
        res.status(200).json(cart)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

exports.removeFromCart = async (req,res)=>{
    try {
        const itemId = req.params.id

        const userId = req.user._id
        const isUserIdTrue = mongoose.Types.ObjectId.isValid(userId)
        if(!isUserIdTrue){
            throw new Error()
        }
        let cart = await Cart.findOne({userId})
        console.log(cart);
        

        const itemIndex= cart.products.findIndex(item=>item._id.toString()=== itemId)
        cart.products.splice(itemIndex,1)

        await cart.save()
        res.status(200).json({message:'Item removed successfully',cart})

    } catch (error) {
         console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}