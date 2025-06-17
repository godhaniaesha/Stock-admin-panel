const moment = require('moment'); 
const Payment = require('../model/payment.model');
const Order = require('../model/order.model');
const Products = require('../model/product.model');
const User = require('../model/Register.model');
const mongoose = require('mongoose');
const InventoryModel = require('../model/inventory.model');
const CategoryModel = require('../model/category.model');


const dashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';
        
        const matchStage = isAdmin ? {} : { 'products.sellerId': new mongoose.Types.ObjectId(userId) };

        // 1. Get basic counts
        const [totalUsers, totalOrders, totalProducts] = await Promise.all([
            User.countDocuments(),
            Order.countDocuments(),
            isAdmin ? Products.countDocuments() : Products.countDocuments({ sellerId: userId })
        ]);

        // 2. Get revenue data
        const [userRevenueResult, overallRevenueResult] = await Promise.all([
            // User revenue calculation
            Payment.aggregate([
                {
                    $match: { status: 'success' }
                },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'order'
                    }
                },
                { $unwind: '$order' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'order.items.productId',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                { $unwind: '$products' },
                { $match: matchStage },
                {
                    $addFields: {
                        matchedItem: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$order.items',
                                        as: 'item',
                                        cond: { $eq: ['$$item.productId', '$products._id'] }
                                    }
                                },
                                0
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: {
                                $multiply: [
                                    '$matchedItem.quantity',
                                    {
                                        $subtract: [
                                            '$products.price',
                                            { $multiply: [
                                                '$products.price',
                                                { $divide: ['$order.discountAmount', '$order.totalAmount'] }
                                            ]}
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            ]),
            // Overall revenue calculation
            Payment.aggregate([
                {
                    $match: { status: 'success' }
                },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'order'
                    }
                },
                { $unwind: '$order' },
                {
                    $match: {
                        'order.status': { $nin: ['cancelled', 'pending'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ])
        ]);

        // sellingRate 
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
 
        const recentOrders = await Order.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $match: {
                    ...(isAdmin ? {} : { 'products.sellerId': new mongoose.Types.ObjectId(userId) }),
                    createdAt: { $gte: thirtyDaysAgo },
                    status: { $nin: ['cancelled', 'pending'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const totalDays = recentOrders.length;
        const totalRecentOrders = recentOrders.reduce((sum, day) => sum + day.count, 0);
        const sellingRate = totalDays > 0 ? (totalRecentOrders / totalDays).toFixed(2) : 0;
 

        // 3. Get sales performance data
        const today = moment().endOf('day');
        const numWeeks = 4;
        const daysPerWeek = 7;
        const weekRanges = Array.from({ length: numWeeks }, (_, i) => {
            const end = moment(today).subtract(i, 'weeks').endOf('day');
            const start = moment(end).subtract(daysPerWeek - 1, 'days').startOf('day');
            return { start: start.toDate(), end: end.toDate() };
        }).reverse();

        const salesPerformance = await Order.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: weekRanges[0].start, 
                        $lte: weekRanges[weekRanges.length - 1].end 
                    }
                }
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $match: matchStage },
            {
                $addFields: {
                    discountMultiplier: {
                        $cond: [
                            { $gt: ['$totalAmount', 0] },
                            { $subtract: [1, { $divide: ['$discountAmount', '$totalAmount'] }] },
                            1
                        ]
                    }
                }
            },
            {
                $project: {
                    createdAt: 1,
                    value: {
                        $multiply: [
                            '$items.quantity',
                            '$product.price',
                            '$discountMultiplier'
                        ]
                    },
                    orderId: '$_id'
                }
            }
        ]);

        // 4. Get low stock products
        const matchStageforStock = isAdmin ? {} : { 'sellerId': new mongoose.Types.ObjectId(userId) };
        const lowStockItems = await InventoryModel.aggregate([
            {
                $match: {
                    $expr: { $lte: ["$quantity", "$lowStockLimit"] }
                }
            },
            { $match: matchStageforStock }, // Match sellerId directly from inventory
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            { $unwind: '$productData' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            { $unwind: '$categoryData' },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategoryData'
                }
            },
            { $unwind: '$subcategoryData' },
            {
                $project: {
                    _id: 1,
                    productName: '$productData.productName',
                    currentStock: '$quantity',
                    lowStockLimit: '$lowStockLimit',
                    category: '$categoryData.title',
                    subcategory: '$subcategoryData.subcategoryTitle',
                    productId: '$productData._id',
                    sellerId: '$sellerId', // Use sellerId directly from inventory
                    productImage: '$productData.images'
                }
            },
            { $sort: { currentStock: 1 } }
        ]);

        // 5. Get seller orders
        const sellerOrders = await Order.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            { $unwind: '$products' },
            { $match: matchStage },
            {
                $group: {
                    _id: '$_id',
                    orderDetails: { $first: '$$ROOT' },
                    sellerItems: {
                        $push: {
                            productId: '$items.productId',
                            quantity: '$items.quantity',
                            price: '$product.price',
                            productName: '$product.productName'
                        }
                    },
                    sellerTotal: {
                        $sum: {
                            $multiply: [
                                '$items.quantity',
                                '$product.price'
                            ]
                        }
                    }
                }
            },
            {
                $addFields: {
                    discountRatio: {
                        $cond: [
                            { $gt: ['$orderDetails.totalAmount', 0] },
                            { $divide: ['$sellerTotal', '$orderDetails.totalAmount'] },
                            0
                        ]
                    },
                    orderDiscount: '$orderDetails.discountAmount'
                }
            },
            {
                $addFields: {
                    sellerDiscount: { $multiply: ['$orderDiscount', '$discountRatio'] },
                    sellerTotalAfterDiscount: { 
                        $subtract: [
                            '$sellerTotal', 
                            { $multiply: ['$orderDiscount', '$discountRatio'] }
                        ] 
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    orderDetails: {
                        firstName: '$orderDetails.firstName',
                        lastName: '$orderDetails.lastName',
                        email: '$orderDetails.email',
                        createdAt: '$orderDetails.createdAt',
                        status: '$orderDetails.status',
                        deliveryCharge: '$orderDetails.deliveryCharge',
                        paymentStatus: '$orderDetails.paymentStatus'
                    },
                    sellerItems: 1,
                    sellerTotal: 1,
                    sellerDiscount: 1,
                    sellerTotalAfterDiscount: 1
                }
            },
            { $sort: { 'orderDetails.createdAt': -1 } }
        ]);

        const ConfirmOrder = sellerOrders.filter((v)=> (
            // v.orderDetails.status != "pending" && 
            v.orderDetails.status != "cancelled")).length

            
        // 6. Category Wise Products
        const categories = await CategoryModel.find();
 
        // Get all orders with their items and products
        const orders = await Order.find({ status: 'delivered' })
            .populate({
                path: 'items.productId',
                populate: {
                    path: 'categoryId',
                    model: 'Category'
                }
            });
 
        // Calculate total sales amount
        const totalSales = orders.reduce((sum, order) => sum + order.finalAmount, 0);
 
        // Calculate sales per category
        const categorySales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const categoryId = item.productId.categoryId._id.toString();
                const itemTotal = item.productId.price * item.quantity;
 
                if (!categorySales[categoryId]) {
                    categorySales[categoryId] = 0;
                }
                categorySales[categoryId] += itemTotal;
            });
        });
 
        // Create simplified response with only category name and sales percentage
        const categoryStats = categories.map(category => {
            const categoryId = category._id.toString();
            const salesAmount = categorySales[categoryId] || 0;
            const salesPercentage = totalSales > 0 ? ((salesAmount / totalSales) * 100).toFixed(2) : 0;
 
            return {
                categoryName: category.title,
                image:category.image,
                salesPercentage: `${salesPercentage}%`
            };
        });

        // Process sales performance data
        const salesPerformanceData = {
            '7d': Array.from({ length: 7 }, (_, i) => {
                const dayStart = moment(weekRanges[weekRanges.length - 1].start).add(i, 'days').startOf('day');
                const dayEnd = moment(dayStart).endOf('day');
                
                const ordersForDay = salesPerformance.filter(order =>
                    moment(order.createdAt).isBetween(dayStart, dayEnd, null, '[]')
                );
                
                const uniqueOrderIds = new Set(ordersForDay.map(o => o.orderId.toString()));
                const value = ordersForDay.reduce((sum, o) => sum + o.value, 0);
                
                return {
                    name: dayStart.format('ddd'), // Gets short day name (Mon, Tue, etc.)
                    value: Math.round(value * 100) / 100,
                    orders: uniqueOrderIds.size
                };
            }),
            '30d': weekRanges.map((week, index) => {
                const weekStart = moment(week.start).startOf('day');
                const weekEnd = moment(week.end).endOf('day');
                
                const ordersForWeek = salesPerformance.filter(order =>
                    moment(order.createdAt).isBetween(weekStart, weekEnd, null, '[]')
                );
                
                const uniqueOrderIds = new Set(ordersForWeek.map(o => o.orderId.toString()));
                const value = ordersForWeek.reduce((sum, o) => sum + o.value, 0);
                
                return {
                    name: `Week ${index + 1}`,
                    value: Math.round(value * 100) / 100,
                    orders: uniqueOrderIds.size
                };
            })
        };

        res.status(200).json({
            userRevenue: userRevenueResult[0]?.total ? parseInt(userRevenueResult[0].total.toFixed(2)) : 0,
            overallRevenue: overallRevenueResult[0]?.total || 0,
            totalUsers,
            totalOrders,
            totalProducts,
            salesPerformance: salesPerformanceData,
            lowStockProducts: lowStockItems,
            sellerOrders,
            categoryStats,
            ConfirmOrder,
            sellingRate
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { dashboard };