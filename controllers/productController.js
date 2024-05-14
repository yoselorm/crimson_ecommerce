const mongoose = require('mongoose');
const Product = require('../models/productModel')
const cloudinary = require('../utils/cloudinary');
const Category = require('../models/categoryModel'); 

exports.addProduct = async (req, res) => {
    try {
        const { product_name, description, price, category } = req.body;

        let existingCategory = await Category.findOne({ name: category });
        if (!existingCategory) {
            existingCategory = await Category.create({ name: category });
        }

        if (!product_name || !description || !price || !category) {
            return res.status(422).json({ error: "Please fill all required fields" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(422).json({ error: "Image is required" });
        }
        const productImages = [];

        for (const file of req.files) {
            const productImage = await cloudinary.uploader.upload(file.path, {
                folder: "product_images"
            });
            productImages.push({
                img_url: productImage.secure_url,
                public_id: productImage.public_id
            });
        }
        const product = await Product.create({
            product_name,
            description,
            price,
            category: existingCategory._id, // Associate the product with the category
            image: productImages
        });
        return res.status(201).json({ message: 'Product added successfully', product });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
};


exports.getProducts = async (req,res)=>{
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Server error'})
    }
}


exports.getProductById = async (req,res) =>{
    try {
        const productId = req.params.id;
        const isTrue = mongoose.Types.ObjectId.isValid(productId)
        if(!isTrue){
            throw new Error()
        }
        const product = await Product.findById(productId)
        if(!product){
            res.status(404).json({message:'Product not found'})
        }
        res.status(200).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Server error'})
    }
}

exports.updateProduct = async (req,res) =>{
    try {
        const{product_name,description,price,category} = req.body;
        // res.send(req.body)
        // return
        if (!product_name || !description || !price || !category) {
            return res.status(422).json({ error: "Please provide all required fields" });
        }
        
        if (req.files && req.files.length > 0) {
            const productImages = [];

            for (const file of req.files) {
                const productImage = await cloudinary.uploader.upload(file.path, {
                    folder: "product_images"
                });
                productImages.push({
                    img_url: productImage.secure_url,
                    public_id: productImage.public_id
                });
            }

            for (const image of existingProduct.image) {
                await cloudinary.uploader.destroy(image.public_id);
            }

            let product = await Product.findById(req.params.id)
            product.product_name = product_name;
            product.description = description;
            product.price = price;
            product.category = category;
            product.image = productImages;

            await product.save()
            res.status(200).json({ messge: 'Product updated successfully' ,product})  
        }else{
           return res.status(422).json({error:'Image required'})
        }     

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' })
        
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const isTrue = mongoose.Types.ObjectId.isValid(productId)
        if(!isTrue){
            throw new Error()
        }
        const deletedProduct = await Product.findOneAndDelete({ _id: productId });
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json({ Error: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.searchProduct = async (req,res) =>{
    try {
        const { productName } = req.query;

        if (!productName) {
            return res.status(422).json({ error: "Product name is required for search" });
        }

        const products = await Product.find({
            product_name: { $regex: new RegExp(productName, "i") } 
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


