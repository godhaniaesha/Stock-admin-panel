const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description:  {
        type: String,
    },
    imageUrl:  {
        type: String
    },
}, { timestamps: true });

 const CategoryModel = mongoose.model('Category', CategorySchema);
 module.exports  = CategoryModel