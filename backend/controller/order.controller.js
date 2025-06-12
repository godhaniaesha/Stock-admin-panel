const { Order, Product } = require('../model');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const {
            userId,
            couponId,
            firstName,
            lastName,
            email,
            phone,
            address,
            zipCode,
            city,
            country,
            paymentMethod,
            paymentDetails,
            items,
            totalAmount,
            discountAmount,
            deliveryCharge,
            tax,
            finalAmount
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items are required and must be a non-empty array'
            });
        }

        // Validate products exist and calculate total
        let calculatedTotal = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }
            calculatedTotal += product.price * item.quantity;
        }

        const newOrder = new Order({
            userId,
            couponId,
            // Personal Details
            firstName,
            lastName,
            email,
            phone,
            // Shipping Details
            address,
            zipCode,
            city,
            country,
            // Payment Details
            paymentMethod,
            paymentDetails,
            // Order Items
            items,
            // Amount Details
            totalAmount: calculatedTotal,
            discountAmount: discountAmount || 0,
            deliveryCharge,
            tax,
            finalAmount,
            // Status
            paymentStatus: 'pending',
            status: 'pending'
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
            .populate({
                path: 'items.productId',
                populate: [
                    { path: 'categoryId', model: 'Category' },
                    { path: 'subcategoryId', model: 'Subcategory' },
                    { path: 'sellerId', model: 'usersaa' }
                ]
            });
        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
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
        const order = await Order.findById(req.params.id)
            .populate('userId')
            .populate('couponId')
            .populate({
                path: 'items.productId',
                populate: [
                    { path: 'categoryId', model: 'Category' },
                    { path: 'subcategoryId', model: 'Subcategory' },
                    { path: 'sellerId', model: 'usersaa' } // Assuming 'seller' refers to the 'user' model
                ]
            });
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
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get orders by user ID
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId: userId })
            .populate({
                path: 'userId',
                model: 'usersaa' // Use 'usersaa' as per Register.model.js export
            })
            .populate({
                path: 'couponId',
                model: 'coupon' // Use 'coupon' as per coupon.model.js export
            })
            .populate({
                path: 'items.productId',
                model: 'product',
                populate: [
                    {
                        path: 'categoryId',
                        model: 'Category' // Use 'Category' as per category.model.js export
                    },
                    {
                        path: 'subcategoryId',
                        model: 'Subcategory' // Use 'Subcategory' as per subcategory.model.js export
                    },
                    {
                        path: 'sellerId',
                        model: 'usersaa' // Use 'user' as per addUser.model.js export
                    }
                ]
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
