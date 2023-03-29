const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 25,
    }

},
    {
        timestamps: true
    })

const Category = mongoose.model('Category', CategoriesSchema);

module.exports = Category;