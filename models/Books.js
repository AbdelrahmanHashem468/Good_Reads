const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    authorId:{
        type: mongoose.Types.ObjectId,
        ref: 'Author'
    }
},{
    timestamps: true
})

const Book = mongoose.model('Book', booksSchema)

module.exports = Book