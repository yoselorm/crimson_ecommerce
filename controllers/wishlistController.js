const Wishlist = require('../models/wishlistModel')
const mongoose = require('mongoose')

exports.addToWishlist = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const isTrue = mongoose.Types.ObjectId.isValid(productId)
        if(!isTrue){
            throw new Error()
        }
        if (!productId || !quantity) {
            return res.status(400).json({ error: 'productId and quantity are required' });
        }
        //this one I put here to check if the user already doesnt have a wishlist list or not
        const userId = req.user._id
        const isUserIdTrue = mongoose.Types.ObjectId.isValid(userId)
        if(!isUserIdTrue){
            throw new Error()
        }
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        const existingProductIndex = wishlist.products.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );

        if (existingProductIndex !== -1) {
            // for here adey check if the product exists, if yeah then update its quantity
            wishlist.products[existingProductIndex].quantity += quantity;
        } else {
            // else just add am to the wishlist
            wishlist.products.push({ productId, quantity });
        }

        await wishlist.save();

        res.json({ message: 'Product added to wishlist successfully', wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getWishlistItems = async (req, res) => {
    try {
        const userId = req.user._id
        const isUserIdTrue = mongoose.Types.ObjectId.isValid(userId)
        if(!isUserIdTrue){
            throw new Error()
        }
        //so here I learnt you use the findById is the id is being used as a primary key in your schema but findOne when it
        //is just a sepereate field 
        const wishlist = await Wishlist.findOne({userId})
        if (!wishlist) {
            return res.status(404).json({ error: 'Empty wishlist' });
          }
        res.status(200).json(wishlist)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

exports.removeFromWishlist = async (req,res)=>{
    try {
        const itemId = req.params.id

        const userId = req.user._id
        const isUserIdTrue = mongoose.Types.ObjectId.isValid(userId)
        if(!isUserIdTrue){
            throw new Error()
        }
        let wishlist = await Wishlist.findOne({userId})

        const itemIndex= wishlist.products.findIndex(item=>item._id.toString()=== itemId)
        wishlist.products.splice(itemIndex,1)

        await wishlist.save()
        res.status(200).json({message:'Item removed successfully',wishlist})

    } catch (error) {
         console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}