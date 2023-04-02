const { Categories, Books, Authors } = require("../models");
const { BaseError } = require('../libs');
const fs = require('fs')

const create = async (data) => {
    const cat = await Categories.findById(data.categoryId);
    const author = await Authors.findById(data.authorId);

    if (!cat) throw new BaseError('category not found',400)
    if (!author) throw new BaseError('author not found',400)

    const book = await Books.create(data);
    return book;
}

const deleteBook = async (id, url) => {
    let book = await Books.findByIdAndDelete(id)
    if (!book) throw new BaseError('book not found',400)
    let oldPhoto = book.photo.split(url)[1]
    if (fs.existsSync(oldPhoto)) {
        fs.unlinkSync(oldPhoto);
    }
    return book;
}

const update=async (id,data,url) => {
    let book = await Books.findById(id)
    if (!book) throw new BaseError('book not found',400)

    if(data.authorId ){
        const author = await Authors.findById(data.authorId);
        if (!author) throw new BaseError('author not found',400)
    }
 
    if(data.categoryId ){
        const cat = await Categories.findById(data.categoryId);
        if (!cat) throw new BaseError('category not found',400)
    }
    let newBook = await Books.findByIdAndUpdate(id, data, { new: true })
    if (!newBook) throw new BaseError('error updating book',500)

    if (data.photo) { //if error occurs in update, photo won't be deleted?!!
        let oldPhoto = book.photo.split(url)[1]
        if (fs.existsSync(oldPhoto)) {
            fs.unlinkSync(oldPhoto);
        }
    }
    return newBook;
}

const getBooks=()=>Books.find({}).populate('categoryId authorId')


module.exports = {
    create,
    deleteBook,
    update,
    getBooks,
};