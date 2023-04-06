const { Categories, Books, Authors ,Shelf} = require("../models");
const { BaseError } = require('../libs');
const { deletePhoto } = require('../libs');

const create = async (data) => {
    const cat = await Categories.findById(data.categoryId);
    const author = await Authors.findById(data.authorId);

    if (!cat) throw new BaseError('category not found', 400)
    if (!author) throw new BaseError('author not found', 400)

    const book = await Books.create(data);
    return book;
}

const deleteBook = async (id) => {
    let book = await Books.findByIdAndDelete(id)
    if (!book) throw new BaseError('book not found', 400);
    const public_Id = book.photo.split('/')[7].split('.')[0]
    deletePhoto(public_Id);
    return book;
}

const update = async (id, data) => {
    let book = await Books.findById(id)
    if (!book) throw new BaseError('book not found', 400)

    if (data.authorId) {
        const author = await Authors.findById(data.authorId);
        if (!author) throw new BaseError('author not found', 400)
    }

    if (data.categoryId) {
        const cat = await Categories.findById(data.categoryId);
        if (!cat) throw new BaseError('category not found', 400)
    }
    let newBook = await Books.findByIdAndUpdate(id, data, { new: true })
    if (!newBook) throw new BaseError('error updating book', 500)
    return newBook;
}

const getBooks = async (limit, page) => {
    const books = Books.paginate({}, {
        page: page || 1,
        limit: limit > 0 && limit < 10 ? limit : 10,
        populate: [{path:'authorId', select: 'firstName lastName' },{path:'categoryId', select: 'Name'}],
        select :'-reviews'
    })
    return books
};

const getBookByID = async (id,userid) => {
    const book = await Books.findById(id).populate({ path: 'categoryId', select: 'Name' })
    .populate({ path: 'authorId', select: 'firstName lastName' })

    if (!book) {
        throw new BaseError('book not found', 400);
    }
    const user=await Shelf.findOne({userId: userid,'books.bookId':book._id}).select({ books: { $elemMatch: { bookId: book._id } } })
    const shelf=user.books[0]
    
    return {book,shelf};
};

const addReview = async (bookId, userId, comment) => {
    const filter = { _id: bookId, "reviews.userId": { $ne: userId } };
    const update = { $push: { reviews: { userId, comment } } };
    const options = { new: true };

    const book = await Books.findOneAndUpdate(filter, update, options);
    if (!book) throw new BaseError('user already commented',400)

    return book;
}

const editReview = async (bookId, userId, comment) => {
    const filter = { _id: bookId, "reviews.userId": userId };
    const update = { $set: { "reviews.$.comment": comment } };
    const options = { new: true };

    const book = await Books.findOneAndUpdate(filter, update, options);

    if (!book) throw new BaseError('couldn\'t update book', 400);
    return book;
}

const getpopular = ()=>Books.find({}).sort([['avgRate',-1],['ratingNumber',-1]]).limit(10).select('photo name ')

module.exports = {
    create,
    deleteBook,
    update,
    getBooks,
    getBookByID,
    addReview,
    editReview,
    getpopular
};