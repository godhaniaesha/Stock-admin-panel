const mongoose = require('mongoose');
const { Inventory } = require('../model');

// Create Inventory
const createInventory = async (req, res) => {
    try {
        const { category, subcategory, sellerId, product, quantity, lowStockLimit } = req.body;
        const inventory = new Inventory({ category, subcategory, sellerId, product, quantity, lowStockLimit });
        await inventory.save();
        res.status(201).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All Inventory
// Get All Inventory with Lookup
const getInventories = async (req, res) => {
    try {
        const inventories = await Inventory.aggregate([
            {
                $lookup: {
                    from: 'categories', // collection name in MongoDB
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $unwind: '$categoryData'
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'subcategoryData'
                }
            },
            {
                $unwind: '$subcategoryData'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $unwind: '$productData'
            }
        ]);
        res.json(inventories);
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
        const lowInventory = await Inventory.aggregate([
            {
                $match: {
                    $expr: { $lte: ['$quantity', '$lowStockLimit'] }
                }
            },
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