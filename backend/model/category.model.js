const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    description: String,
    image: String,
}, { timestamps: true });

// Pre-save hook to capitalize the first letter and lowercase the rest
CategorySchema.pre('save', function (next) {
    if (this.title) {
        this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
    }
    next();
});

// Define a unique index with case-insensitive collation
CategorySchema.index({ title: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const CategoryModel = mongoose.model('Category', CategorySchema);
module.exports = CategoryModel;
