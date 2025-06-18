const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  subcategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'subcategory',
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'seller',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tagNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: 0
  },
  warehouseLocation: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    min: 0
  },
  images: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
    versionKey: false
});

const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel;
