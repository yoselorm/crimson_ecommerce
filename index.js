const express = require('express');
const database = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const wishlistRouter = require('./routes/wishlistRoutes');
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const isAdmin = require('./middlewares/adminCheck');
const app = express()
const PORT = 5000;




app.use(express.json())
app.use(express.urlencoded({ extended: true }))


database()


//routes
app.use('/api/v1',authRoutes);
app.use(authMiddleware)

app.use('/api/v1',profileRoutes);
app.use('/api/v1',productRouter);
app.use('/api/v1',cartRouter)
app.use('/api/v1',wishlistRouter)
app.use('/api/v1',orderRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1',categoryRouter)


app.listen(PORT,()=>{
    console.log(`Ecommerce running on port ${PORT}`);
    
})