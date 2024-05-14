const express = require('express')
const {addProduct,getProducts,getProductById, deleteProduct, updateProduct, searchProduct} = require('../controllers/productController')
const { imageUpload, imageSize } = require('../middlewares/imageUpload')
const isAdmin = require('../middlewares/adminCheck')

const productRouter = express.Router()
productRouter.get('/products/search-product',searchProduct)
productRouter.post('/products', isAdmin, imageUpload.array('image', 3), imageSize, addProduct);
productRouter.get('/products',getProducts)
productRouter.get('/products/:id',getProductById)
productRouter.put('/products/:id',isAdmin,updateProduct)
productRouter.delete('/products/:id',isAdmin,deleteProduct)


module.exports = productRouter