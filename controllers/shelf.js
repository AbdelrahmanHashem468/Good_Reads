const { BaseError } = require("../libs");
const { Shelf, Books } = require("../models");

const updateBooks = async (filter) => {
    let result;
    const bookExists = await Books.findById(filter.bookId)
    if(!bookExists) throw new BaseError('Book not found',400);
    let previousRating = 0;

    const addBook = await Shelf.findOneAndUpdate({ userId: filter.userId, 'books.bookId': { $ne: filter.bookId } },
        { $push: { books: { bookId: filter.bookId, rating: filter.rating, shelf: filter.shelf } } }, { new: true })
        .select({ books: { $elemMatch: { bookId: filter.bookId } } });

    if (!addBook) {
        const condition = {
            userId: filter.userId,
            books: { $elemMatch: { bookId: filter.bookId } }
        };
        const update = { $set: { 'books.$.rating': filter.rating, 'books.$.shelf': filter.shelf } };
        const result = await Shelf.findOneAndUpdate(condition, update).select({ books: { $elemMatch: { bookId: filter.bookId } } });
        previousRating = result.books[0].rating
    };
    if (filter.rating) {
        updateAvgRating(filter.bookId, filter.rating, previousRating)
    }
    if (addBook) return addBook
    result = await Shelf.findOne({ userId: filter.userId }).select({ books: { $elemMatch: { bookId: filter.bookId } } });
    return result
}

const updateAvgRating = async (bookId, rating, previousRating) => {
    const book = await Books.findById(bookId);
    if (previousRating) {
        book.totalRating = book.totalRating - previousRating + rating;
    } else {
        book.totalRating = book.totalRating + rating;
        book.ratingNumber++;
    }
    book.save();
}


const deleteBook = async (filter) => {
    const oldBook = await Shelf.findOne({ userId: filter.userId }).select({ books: { $elemMatch: { bookId: filter.bookId } } });
    if(!oldBook.books[0])
        return ;
    const deletedbook = await Shelf.findOneAndUpdate({userId: filter.userId},
        { $pull:{ books: { bookId: filter.bookId } }});
    if(!oldBook.books[0].rating)
        return deletedbook;
    const book = await Books.findById(filter.bookId);
    book.totalRating = book.totalRating - oldBook.books[0].rating;
    book.ratingNumber--;
    book.save();
    return oldBook;
};

const getUserBooks = async (shelf,userId) => {
    if (!shelf)
    {
        const books =  await Shelf.findOne({ userId: userId }).populate([{ path: 'books.bookId',populate:[{path:'authorId', select:'firstName lastName'}], select: 'photo name' }]);
        return books;
    }
    
    const books = Shelf.findOne({ userId: userId })
    .select({
    books: {
        $filter: {
        input: '$books',
        as: 'book',
        cond: { $eq: ['$$book.shelf', shelf] }
        }
    }
    })
    .populate([{ path: 'books.bookId',populate:[{path:'authorId', select:'firstName lastName'}], select: 'photo name' }]);
    // const books = Shelf.aggregate([
    //     { $match :{userId: new mongoose.Types.ObjectId(userId)}},
    //     { $unwind: '$books' },
    //     { $match: { 'books.shelf': shelf } },
    //     { $group: { _id: '$_id', books: { $push: '$books' } } }
    // ]);

    return books;
}

module.exports = { 
    updateBooks,
    deleteBook,
    getUserBooks
};