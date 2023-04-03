const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategoriesSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 25,
    }

},
    {
        timestamps: true
    })

CategoriesSchema.plugin(mongoosePaginate);


const Category = mongoose.model('Category', CategoriesSchema);

module.exports = Category;