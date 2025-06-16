const Payment = require('../model/payment.model');
const Order = require('../model/order.model');


const getSalesMetrics = async (req, res) => {
    try {
        const { role, _id } = req.user;
        const { period, startDate: customStartDate, endDate: customEndDate } = req.query;

        // Calculate date ranges based on period
        const now = new Date();
        let startDate;
        let endDate = now;

        switch (period) {
            case 'last_7_days':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'last_30_days':
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
            case 'last_quarter':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case 'custom':
                if (!customStartDate || !customEndDate) {
                    return res.status(400).json({ error: 'Start date and end date are required for custom period' });
                }
                startDate = new Date(customStartDate);
                endDate = new Date(customEndDate);
                break;
            default:
                startDate = new Date(0); // If no period specified, get all time
        }

        // Base match condition for payments
        let matchCondition = {
            status: 'success',
            createdAt: { $gte: startDate, $lte: endDate }
        };

        // If user is a seller, get their products first
        let sellerProductIds = [];
        if (role === 'seller') {
            const sellerProducts = await Product.find({ sellerId: _id }).select('_id');
            sellerProductIds = sellerProducts.map(product => product._id.toString());
        }

        // Get total sales with role-based filtering
        let totalSales = 0;
        if (role === 'seller') {
            // For sellers, get orders with their products and calculate their portion
            const orders = await Order.find({
                status: 'delivered',
                'items.productId': { $in: sellerProductIds },
                createdAt: { $gte: startDate, $lte: endDate }
            }).populate('items.productId');

            totalSales = orders.reduce((sum, order) => {
                const sellerItems = order.items.filter(item =>
                    sellerProductIds.includes(item.productId._id.toString())
                );
                const sellerItemsTotal = sellerItems.reduce((itemSum, item) =>
                    itemSum + (item.productId.price * item.quantity), 0
                );
                const originalTotal = order.items.reduce((itemSum, item) =>
                    itemSum + (item.productId.price * item.quantity), 0
                );
                const ratio = sellerItemsTotal / originalTotal;
                return sum + (order.finalAmount * ratio);
            }, 0);
        } else {
            // For admin, get total sales from payments
            const totalSalesResult = await Payment.aggregate([
                { $match: matchCondition },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            totalSales = totalSalesResult[0]?.total || 0;
        }

        // Get total orders with role-based filtering
        let orderMatchCondition = {
            status: 'delivered',
            createdAt: { $gte: startDate, $lte: endDate }
        };
        if (role === 'seller') {
            orderMatchCondition['items.productId'] = { $in: sellerProductIds };
        }
        const totalOrdersCount = await Order.countDocuments(orderMatchCondition);

        // Get successful orders count
        const successfulOrdersCount = await Order.countDocuments(orderMatchCondition);

        // Calculate average order value
        const avgOrderValue = successfulOrdersCount > 0 ? (totalSales / successfulOrdersCount).toFixed(2) : 0;

        // Calculate conversion rate
        const conversionRate = totalOrdersCount > 0 ? ((successfulOrdersCount / totalOrdersCount) * 100).toFixed(2) : 0;

        // Get sales data over time with role-based filtering
        let salesData = [];
        if (role === 'seller') {
            // For sellers, calculate their portion of sales for each day
            const orders = await Order.find(orderMatchCondition)
                .populate('items.productId')
                .sort({ createdAt: 1 });

            const salesByDay = {};
            orders.forEach(order => {
                const dayOfWeek = order.createdAt.getDay();
                const sellerItems = order.items.filter(item =>
                    sellerProductIds.includes(item.productId._id.toString())
                );
                const sellerItemsTotal = sellerItems.reduce((sum, item) =>
                    sum + (item.productId.price * item.quantity), 0
                );
                const originalTotal = order.items.reduce((sum, item) =>
                    sum + (item.productId.price * item.quantity), 0
                );
                const ratio = sellerItemsTotal / originalTotal;
                const sellerPortion = order.finalAmount * ratio;

                if (!salesByDay[dayOfWeek]) {
                    salesByDay[dayOfWeek] = 0;
                }
                salesByDay[dayOfWeek] += sellerPortion;
            });

            salesData = Object.entries(salesByDay).map(([dayOfWeek, totalSales]) => ({
                dayOfWeek: parseInt(dayOfWeek) + 1,
                totalSales
            }));
        } else {
            // For admin, get sales data from payments
            salesData = await Payment.aggregate([
                { $match: matchCondition },
                {
                    $group: {
                        _id: { $dayOfWeek: '$createdAt' },
                        totalSales: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        dayOfWeek: '$_id',
                        totalSales: '$totalSales'
                    }
                },
                { $sort: { dayOfWeek: 1 } }
            ]);
        }

        // Get orders data over time
        const ordersData = await Order.aggregate([
            { $match: orderMatchCondition },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    dayOfWeek: '$_id',
                    totalOrders: '$totalOrders'
                }
            },
            { $sort: { dayOfWeek: 1 } }
        ]);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const formattedData = days.map((day, index) => {
            const dayOfWeekMongo = (index + 1) % 7 === 0 ? 7 : (index + 1) % 7;

            const foundSales = salesData.find(d => d.dayOfWeek === dayOfWeekMongo);
            const foundOrders = ordersData.find(d => d.dayOfWeek === dayOfWeekMongo);

            return {
                day,
                sales: foundSales ? Math.round(foundSales.totalSales * 100) / 100 : 0,
                orders: foundOrders ? foundOrders.totalOrders : 0,
            };
        });

        // Reorder to start from Monday
        const reorderedData = [
            ...formattedData.slice(1), // Monday to Saturday
            formattedData[0] // Sunday
        ];

        res.status(200).json({
            totalSales: Math.round(totalSales * 100) / 100,
            totalOrders: totalOrdersCount,
            avgOrderValue,
            conversionRate: `${conversionRate}%`,
            ordersAndSalesOverTime: reorderedData,
            period: period || 'all_time',
            startDate,
            endDate,
            role: role
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};




const getAllSalesOrders = async (req, res) => {
    try {
        const { role, _id } = req.user;
        const { period } = req.query; // Get period from query params

        // Calculate date ranges based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case 'this_month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'last_month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                break;
            case 'last_3_months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;
            default:
                startDate = new Date(0); // If no period specified, get all time
        }

        let query = {
            status: 'delivered',
            createdAt: { $gte: startDate }
        };

        // If user is a seller, get their products first
        let sellerProductIds = [];
        if (role === 'seller') {
            const sellerProducts = await Product.find({ sellerId: _id }).select('_id');
            sellerProductIds = sellerProducts.map(product => product._id.toString());

            // Find orders that have at least one item from this seller
            query = {
                ...query,
                'items.productId': { $in: sellerProductIds }
            };
        }

        const orders = await Order.find(query)
            .populate('userId', 'firstName lastName email')
            .populate('items.productId', 'productName price images')
            .populate('couponId', 'title discountPercentage')
            .sort({ createdAt: -1 });

        // For sellers, filter items to only show their products
        let processedOrders = orders;
        if (role === 'seller') {
            processedOrders = orders.map(order => {
                // Filter items to only include seller's products
                const sellerItems = order.items.filter(item =>
                    sellerProductIds.includes(item.productId._id.toString())
                );

                if (sellerItems.length === 0) return null; // Skip orders with no seller items

                // Calculate new totals based on seller's items only
                const sellerItemsTotal = sellerItems.reduce((sum, item) =>
                    sum + (item.productId.price * item.quantity), 0
                );

                // Calculate proportional discount and tax
                const originalTotal = order.items.reduce((sum, item) =>
                    sum + (item.productId.price * item.quantity), 0
                );
                const ratio = sellerItemsTotal / originalTotal;

                return {
                    ...order.toObject(),
                    items: sellerItems,
                    totalAmount: sellerItemsTotal,
                    discountAmount: Math.round(order.discountAmount * ratio * 100) / 100,
                    tax: Math.round(order.tax * ratio * 100) / 100,
                    finalAmount: Math.round((sellerItemsTotal - (order.discountAmount * ratio) + (order.tax * ratio)) * 100) / 100
                };
            }).filter(order => order !== null); // Remove null orders
        }

        // Calculate total sales for the filtered period
        const totalSales = processedOrders.reduce((sum, order) => sum + order.finalAmount, 0);

        res.status(200).json({
            orders: processedOrders,
            totalSales: Math.round(totalSales * 100) / 100,
            period: period || 'all_time',
            startDate,
            endDate: now
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    // getTotalSales,
    // getTotalOrders,
    // getAverageOrderValue,
    // getConversionRate,
    // getSalesOverTime,
    // getOrdersAndSales,
    getSalesMetrics,
    getAllSalesOrders
}; 
