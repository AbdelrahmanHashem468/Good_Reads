const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Book = require('./Books');
const { BaseError } = require('../libs');
const authorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3
    },
    DOB: {
        type: Date,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

authorSchema.plugin(mongoosePaginate);


authorSchema.pre('findOneAndDelete', async function preDelete(next) {
    const authorId = this.getQuery()['_id'];
    const count =  await Book.countDocuments({authorId:authorId});
    if (count > 0) {
        const err = new BaseError('Cannot delete author with associated books',409);
        next(err);
    } else {
        next();
    }
})


const Author = mongoose.model('Author', authorSchema);

module.exports = Author;