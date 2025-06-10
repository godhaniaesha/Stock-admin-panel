const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventorySchema = new mongoose.Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'seller',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
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
module.exports = InventoryModel