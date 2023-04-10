const { BaseError,paginationOption } = require("../libs");
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
        console.log(typeof book.totalRating);
        console.log(typeof previousRating);
        console.log(typeof rating);

        book.totalRating = book.totalRating - previousRating + Number(rating);
        console.log(book.totalRating);
    } else {
        book.totalRating = book.totalRating + Number(rating);
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

const getUserBooks = async (shelf,userId,page,limit) => {
    const pageSize =  limit > 0 && limit < 10 ? Number(limit) : 10;
    const pageNumber = page ? Number(page) : 1;
    // const pageSize =  2;
    // const pageNumber = 1;
    console.log("🚀 ~ file: shelf.js:60 ~ getUserBooks ~ pageSize:", pageSize)
    console.log("🚀 ~ file: shelf.js:61 ~ getUserBooks ~ pageNumber:", pageNumber)

    if (!shelf)
    {
        return getAllUserBooks(userId,pageSize,pageNumber);
    }
    return getUserBooksByShelf(userId,shelf,pageSize,pageNumber)

}

const getAllUserBooks = async (userId,pageSize,pageNumber ) => {
    const count = await Shelf.findOne({ userId: userId });
    const books =  await Shelf.findOne({ userId: userId })
    .select({books:1,_id:0,userId:0,createdAt:0,updatedAt:0,__v:0})
    .slice('books', [pageSize * (pageNumber - 1), pageSize])
    .populate([{ path: 'books.bookId',populate:[{path:'authorId', select:'firstName lastName'}]}]);
    const option = paginationOption(pageSize,pageNumber,count.books.length)
    const result = {
        "docs" : books.books,
        option
    }
    return result;
}


const getUserBooksByShelf = async (userId,shelf,pageSize,pageNumber) => {
    const books = await Shelf.findOne({ userId: userId })
    .populate([{ path: 'books.bookId',populate:[{path:'authorId', select:'firstName lastName'}], select: 'photo name' }])
    .slice('books', [pageSize * (pageNumber - 1), pageSize])
    .select({
    books: {
        $slice:[
            {"$filter" : {
                input: '$books',
                as: 'book',
                cond: { $eq: ['$$book.shelf', shelf] }
                }},
                pageSize * (pageNumber - 1), pageSize
        ]
    },
    _id:0} )


    const count = await Shelf.findOne({ userId: userId })
    .populate([{ path: 'books.bookId',populate:[{path:'authorId', select:'firstName lastName'}], select: 'photo name' }])
    .slice('books', [pageSize * (pageNumber - 1), pageSize])
    .select({
    books: {
        $filter : {
                input: '$books',
                as: 'book',
                cond: { $eq: ['$$book.shelf', shelf] }
                }},
    } )
    const option = paginationOption(pageSize,pageNumber,count.books.length)
    const result = {
        "docs" : books.books,
        option
    }
    return result;
}



module.exports = { 
    updateBooks,
    deleteBook,
    getUserBooks
};