const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
   quantity: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('cart', cartSchema);
