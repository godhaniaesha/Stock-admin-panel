const { Order,Product  } = require('../model');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { userId, couponId, addressId, items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items are required and must be a non-empty array'
            });
        }

        let totalAmount = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }

            totalAmount += product.price * item.quantity;
        }

        const newOrder = new Order({
            userId,
            couponId,
            addressId,
            items,
            totalAmount
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: savedOrder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId')
            .populate('couponId')
            .populate('addressId')
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving orders',
            error: error.message
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate('userId')
            .populate('couponId')
            .populate('addressId')
            .populate('items.productId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order retrieved successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving order',
            error: error.message
        });
    }
};

// Update order
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            data: updatedOrder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
            data: deletedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
};

// Get orders by user ID
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId })
            .populate('couponId')
            .populate('addressId')
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'User orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving user orders',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrdersByUser
};
