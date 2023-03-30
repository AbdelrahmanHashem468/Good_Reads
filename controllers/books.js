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
module.exports = {
    create,
    deleteBook
};