const { Categories, Books, Authors } = require("../models");
const fs = require('fs')

const create = async (data) => {
    const cat = await Categories.findById(data.categoryId);
    const author = await Authors.findById(data.authorId);

    if (!cat) throw new Error('category not found')
    if (!author) throw new Error('author not found')

    const book = await Books.create(data);
    return book;
}

const deleteBook = async (id, url) => {
    let book = await Books.findByIdAndDelete(id)
    if (!book) throw new Error('book not found')
    let oldPhoto = book.photo.split(url)[1]
    if (fs.existsSync(oldPhoto)) {
        fs.unlinkSync(oldPhoto);
    }
    return book;
}

const update=async (id,data,url) => {
    let book = await Books.findById(id)
    if (!book) throw new Error('book not found')

    if(data.authorId ){
        const author = await Authors.findById(data.authorId);
        if (!author) throw new Error('author not found')
    }
 
    if(data.categoryId ){
        const cat = await Categories.findById(data.categoryId);
        if (!cat) throw new Error('category not found')
    }
    let newBook = await Books.findByIdAndUpdate(id, data, { new: true })
    if (!newBook) throw new Error('error updating book')

    if (data.photo) { //if error occurs in update, photo won't be deleted?!!
        let oldPhoto = book.photo.split(url)[1]
        if (fs.existsSync(oldPhoto)) {
            fs.unlinkSync(oldPhoto);
        }
    }
    return newBook;
}

const getBooks=()=>Books.find({})


module.exports = {
    create,
    deleteBook,
    update,
    getBooks,
};