const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    lowStockLimit: {
        type: Number,
        required: true
    }
}, { timestamps: true });


 const InventoryModel = mongoose.model('Inventory', InventorySchema);
 module.exports  = InventoryModel