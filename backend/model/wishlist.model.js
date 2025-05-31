const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('wishlist', wishlistSchema);
