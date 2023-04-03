const { Categories, Books, Authors } = require("../models");
const { BaseError } = require('../libs');

const create = async (data) => {
    const cat = await Categories.findById(data.categoryId);
    const author = await Authors.findById(data.authorId);

    if (!cat) throw new BaseError('category not found',400)
    if (!author) throw new BaseError('author not found',400)

    const book = await Books.create(data);
    return book;
}

const deleteBook = async (id) => {
    let book = await Books.findByIdAndDelete(id)
    if (!book) throw new BaseError('book not found',400)
    // let oldPhoto = book.photo.split(url)[1]
    // if (fs.existsSync(oldPhoto)) {
    //     fs.unlinkSync(oldPhoto);
    // }
    return book;
}

const update=async (id,data) => {
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
    return newBook;
}

const getBooks = async (limit,page) => {
    const books = await Books.paginate({}, {
        page: page || 1,
        limit: limit > 0 && limit < 10 ? limit : 10
    });
    return books;
};

const getBookByID = async (id) => {
    const book = await Books.findById(id);
    if (!book){
        throw new BaseError('book not found',400);
    }
    return book;
};


module.exports = {
    create,
    deleteBook,
    update,
    getBooks,
    getBookByID
};