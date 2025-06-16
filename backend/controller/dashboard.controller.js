const Payment = require('../model/payment.model');
const Order = require('../model/order.model');
const Products = require('../model/product.model');
const User = require('../model/Register.model');
const mongoose = require('mongoose');
const moment = require('moment'); 

const dashboard = async (req, res) => {
    try {
        
        console.log("-----------------------------------------",req.user);  
        const userId = req.user._id; // Make sure userId is available via auth middleware

        const isAdmin = req.user.role === 'admin';
  
        const matchStage = isAdmin
          ? {} // No seller filter for admin
          : { 'product.sellerId': mongoose.Types.ObjectId(userId) };

          
        // 1. User-wise Revenue
        // const userRevenueResult = await Payment.aggregate([
        //     {
        //         $match: { status: 'success' }
        //     },
        //     {
        //         $lookup: {
        //             from: 'orders',
        //             localField: 'orderId',
        //             foreignField: '_id',
        //             as: 'order'
        //         }
        //     },
        //     { $unwind: '$order' },
        //     {
        //         $match: {
        //             'order.userId': new mongoose.Types.ObjectId(userId),
        //             'order.status': { $nin: ['cancelled', 'pending'] }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             total: { $sum: '$amount' }
        //         }
        //     }
        // ]);

        const userRevenueResult = await Payment.aggregate([
            // {
            //     $match: { 
            //         status: 'success' 
            //     }
            // },
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
            {
                $match: {
                    // 'order.userId': new mongoose.Types.ObjectId(userId),
                    // 'order.status': { $nin: ['cancelled', 'pending'] },
                    'products.sellerId':  new mongoose.Types.ObjectId(userId)
                }
            },
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
        ]);

        // 2. Overall Revenue
        const overallRevenueResult = await Payment.aggregate([
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
        ]);

        // 3. Get total users count
        const totalUsers = await User.countDocuments();

        // 4. Get total orders count
        const totalOrders = await Order.countDocuments();

        // Get total products count based on user role
        const totalProducts = req.user.role === 'admin' 
            ? await Products.countDocuments() 
            : await Products.countDocuments({ sellerId: userId }); 

        const userRevenue = userRevenueResult[0]?.total ? parseInt(userRevenueResult[0].total.toFixed(2)) : 0;

        const overallRevenue = overallRevenueResult[0]?.total || 0;

        res.status(200).json({
            userRevenue,
            overallRevenue,
            totalUsers,
            totalOrders,
            totalProducts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const Sales_Performance = async (req, res) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';
  
        const matchStage = isAdmin
          ? {} // No seller filter for admin
          : { 'products.sellerId':  new mongoose.Types.ObjectId(userId) };

        const today = moment().endOf('day');
        const numWeeks = 4;
        const daysPerWeek = 7;

      
        const weekRanges = [];
        for (let i = 0; i < numWeeks; i++) {
            const end = moment(today).subtract(i, 'weeks').endOf('day');
            const start = moment(end).subtract(daysPerWeek - 1, 'days').startOf('day');
            weekRanges.unshift({ start: start.toDate(), end: end.toDate() }); // unshift to keep oldest first
        }

     
        const allOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: weekRanges[0].start, $lte: weekRanges[weekRanges.length - 1].end },
                    // status: { $nin: ['cancelled', 'pending'] }
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

        // Organize data into weeks and days
        const result = weekRanges.map(({ start, end }) => {
           
            const days = [];
            for (let i = 0; i < daysPerWeek; i++) {
                const dayStart = moment(start).add(i, 'days').startOf('day');
                const dayEnd = moment(dayStart).endOf('day');
            
                const ordersForDay = allOrders.filter(order =>
                    moment(order.createdAt).isBetween(dayStart, dayEnd, null, '[]')
                );
              
                const uniqueOrderIds = new Set(ordersForDay.map(o => o.orderId.toString()));
            
                const value = ordersForDay.reduce((sum, o) => sum + o.value, 0);
                days.push({
                    date: dayStart.format('YYYY-MM-DD'),
                    value: Math.round(value * 100) / 100,
                    orders: uniqueOrderIds.size
                });
            }
            return days;
        });

        res.status(200).json(result); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getAllSellerOrder = async (req, res) => {
   
    try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';
  
    const matchStage = isAdmin
      ? {} // No seller filter for admin
      : { 'products.sellerId':  new mongoose.Types.ObjectId(userId) };
  
    const orders = await Order.aggregate([
      // 1. Unwind items to process each product in the order
      { $unwind: '$items' },
      // 2. Lookup product details
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      // 3. Match based on user role
      { $match: matchStage },
      // 4. Group items back by order, collecting only the seller's products
      {
        $group: {
          _id: '$_id',
          orderDetails: { $first: '$$ROOT' }, // Keep order-level fields
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
      // 5. Calculate discount for seller's items
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
          sellerTotalAfterDiscount: { $subtract: ['$sellerTotal', { $multiply: ['$orderDiscount', '$discountRatio'] }] }
        }
      },
      // 6. Project the final output
      {
        $project: {
          _id: 1,
          orderDetails: {
            firstName: '$orderDetails.firstName',
            lastName: '$orderDetails.lastName',
            email: '$orderDetails.email',
            createdAt: '$orderDetails.createdAt',
            status: '$orderDetails.status',
            // totalAmount: '$orderDetails.totalAmount',
            // discountAmount: '$orderDetails.discountAmount',
            deliveryCharge: '$orderDetails.deliveryCharge',
            // tax: '$orderDetails.tax',
            // finalAmount: '$orderDetails.finalAmount',
            paymentStatus: '$orderDetails.paymentStatus'
          },
          sellerItems: 1,
          sellerTotal: 1,
          sellerDiscount: 1,
          sellerTotalAfterDiscount: 1
        }
      },
      // 7. Sort by createdAt in descending order (newest first)
      { $sort: { 'orderDetails.createdAt': -1 } }
    ]);
  
    res.status(200).json(orders);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
}
};

module.exports = {
    dashboard,
    Sales_Performance,
    getAllSellerOrder
};
