const mongoose = require('mongoose');
const { Inventory } = require('../model');

// Create Inventory
const createInventory = async (req, res) => {
    try {
        const { category, subcategory, sellerId, product, quantity, lowStockLimit } = req.body;
        // Check if inventory for this seller, product, category, and subcategory already exists
        const existingInventory = await Inventory.findOne({
            category,
            subcategory,
            sellerId,
            product
        });
        if (existingInventory) {
            // If exists, update the quantity by summing
            existingInventory.quantity += Number(quantity);
            if (lowStockLimit) {
                existingInventory.lowStockLimit = lowStockLimit; // Optionally update lowStockLimit
            }
            await existingInventory.save();
            return res.status(200).json({
                message: 'Inventory updated (quantity summed)',
                data: existingInventory
            });
        }
        // If not exists, create new inventory
        const inventory = new Inventory({ category, subcategory, sellerId, product, quantity, lowStockLimit });
        await inventory.save();
        res.status(201).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Inventory
// Get All Inventory with Lookup
// Get All Inventory with Lookup
const getInventories = async (req, res) => {
    try {
        const user = req.user; // user is set by auth middleware
        let matchQuery = {};

        if (user.role === 'admin') {
            // Admin can see all inventory
            matchQuery = {};
        } else if (user.role === 'seller') {
            // Seller can only see their own product inventory
            matchQuery = { sellerId: user._id };
        } else {
            return res.status(403).json({ error: "Access denied" });
        }

        const inventories = await Inventory.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: 'categories', // Assuming your categories collection is named 'categories'
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'subcategories', // Assuming your subcategories collection is named 'subcategories'
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },
            { $unwind: { path: '$subcategory', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'products', // Assuming your products collection is named 'products'
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'usersaas', // Assuming your sellers collection is named 'sellers'
                    localField: 'sellerId',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } }
        ]);

        // Print category, subcategory, and product data for each inventory
        inventories.forEach(inv => {
            console.log('Category:', inv.category);
            console.log('Subcategory:', inv.subcategory);
            console.log('Product:', inv.product);
        });

        res.status(200).json(inventories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


 

// Get Single Inventory
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Inventory
const updateInventory = async (req, res) => {
    try {
        const { category, subcategory, sellerId, product, quantity, lowStockLimit } = req.body;
        console.log("req.body",req.body)
        const updateData = { category, subcategory, sellerId, product, quantity, lowStockLimit };
        console.log("updateData: ", updateData)
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log(inventory, "inventoryyy")
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Inventory
const deleteInventory = async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inventory deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getLowInventory = async (req, res) => {
    try {
        const user = req.user; // user is set by auth middleware
        let matchQuery = {
            $expr: { $lte: ['$quantity', '$lowStockLimit'] }
        };

        if (user.role === 'admin') {
            // Admin can see all low stock inventory
            // matchQuery remains as is
        } else if (user.role === 'seller') {
            // Seller can only see their own low stock inventory
            matchQuery = {
                ...matchQuery,
                sellerId: user._id
            };
        } else {
            return res.status(403).json({ error: "Access denied" });
        }

        const lowInventory = await Inventory.aggregate([
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },
            { $unwind: { path: '$subcategory', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'sellerId',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } }
        ]);

        res.status(200).json(lowInventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    createInventory,
    getInventories,
    getInventory,
    updateInventory,
    deleteInventory,
    getLowInventory
}