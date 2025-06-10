// const mongoose = require('mongoose');

// const SubcategorySchema = new mongoose.Schema({
//     subcategoryTitle: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true
//     },
//     description: String,
//     category: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category',
//         required: true
//     },
//     image: String
// }, { timestamps: true });


//  const SubcategoryModel = mongoose.model('Subcategory', SubcategorySchema);
//  module.exports  = SubcategoryModel

const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    subcategoryTitle: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: String
}, { timestamps: true });

// Format before saving: Capitalize first letter only
SubcategorySchema.pre('save', function (next) {
    if (this.subcategoryTitle) {
        this.subcategoryTitle = this.subcategoryTitle.charAt(0).toUpperCase() + this.subcategoryTitle.slice(1).toLowerCase();
    }
    next();
});

// Create index with collation for case-insensitive uniqueness
SubcategorySchema.index(
    { subcategoryTitle: 1 },
    { unique: true, collation: { locale: 'en', strength: 2 } }
);

const SubcategoryModel = mongoose.model('Subcategory', SubcategorySchema);
module.exports = SubcategoryModel;
