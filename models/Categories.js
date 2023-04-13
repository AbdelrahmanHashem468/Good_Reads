const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Book = require('./Books');
const { BaseError } = require('../libs');
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

CategoriesSchema.pre('findOneAndDelete', async function preDelete(next) {
    const categoryId = this.getQuery()['_id'];
    const count =  await Book.countDocuments({categoryId:categoryId});
    if (count > 0) {
        const err = new BaseError('Cannot delete category with associated books',409);
        next(err);
    } else {
        next();
    }
})

const Category = mongoose.model('Category', CategoriesSchema);

module.exports = Category;