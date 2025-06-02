const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    subcategoryTitle: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: String
}, { timestamps: true });


 const SubcategoryModel = mongoose.model('Subcategory', SubcategorySchema);
 module.exports  = SubcategoryModel