const { default: mongoose } = require('mongoose');
const Order = require('../models/orderModel')

exports.addOrder = async (req, res) => {

    try {
        const { products, totalPrice, shippingAddress, paymentMethod, status } = req.body;
        if (!products || !totalPrice || !shippingAddress || !paymentMethod) {
            return res.status(422).json({ error: 'please fill all required field' })
        }
        const userId = req.user._id;
        const isTrue = mongoose.Types.ObjectId.isValid(userId)
        if (!isTrue) {
            return res.status(400).json({ error: 'User not found' })
        }

        const order = await Order.create({
            products,
            totalPrice,
            shippingAddress,
            paymentMethod,
            status,
            user: userId

        })

        res.status(201).json({ message: 'Order placed successfully', order })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

exports.getOrders = async (req, res) => {
    try {
        const order = await Order.find()
        res.status(200).json({ message: 'All orders', order })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user._id
        const isTrue = mongoose.Types.ObjectId.isValid(userId)
        if (!isTrue) {
            throw new Error('Invalid user ID')
        }

        const orders = await Order.find({ user: userId })

        res.status(200).json({ message: 'User orders', orders })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const isOrderIdValid = mongoose.Types.ObjectId.isValid(orderId);
        if (!isOrderIdValid) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        const order = await Order.findOneAndDelete({ _id: orderId });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateOrder = async (req,res)=>{
    try {
        const {status} = req.body
        const orderId = req.params.id
        const isTrue = mongoose.Types.ObjectId.isValid(orderId)
        if (!isTrue) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}