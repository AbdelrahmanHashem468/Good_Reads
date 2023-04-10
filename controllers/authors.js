const { Authors, Books, Shelf } = require('../models')
const { BaseError, deletePhoto } = require('../libs');

const create = (data) => Authors.create(data)

const update = async (id, data) => {
  let author = await Authors.findById(id)
  if (!author) throw new BaseError('author not found', 400)
  let newAuthor = await Authors.findByIdAndUpdate(id, data, { new: true })
  if (!newAuthor) throw new BaseError('error updating author', 500)

  return newAuthor;
}

const deleteAuthor = async (id) => {
  let author = await Authors.findByIdAndDelete(id)
  if (!author) throw new BaseError('author not found', 400)
  const public_Id = author.photo.split('/')[7].split('.')[0]
  deletePhoto(public_Id);
  return author;
}

const getAuthors = async (limit, page) => {
  const authors = await Authors.paginate({}, {
    page: page || 1,
    limit: limit > 0 && limit < 10 ? limit : 10
  });
  return authors;
};

const getAuthorById = async (id, userId) => {
  const author = await Authors.findById(id);
  if (!author) throw new BaseError('author not found', 400);
  const authorBooks = await Books.find({ authorId: author._id }).select('-categoryId -authorId -reviews').lean();
  if (!userId) return { author, authorBooks };

  for (let book of authorBooks) {
    const shelf = await Shelf.findOne({ userId, 'books.bookId': book._id }).select({ books: { $elemMatch: { bookId: book._id } } }).lean()
    if (shelf) {
      book.userRate = shelf.books[0].rating;
      book.shelf = shelf.books[0].shelf;
      console.log(book.userRate);
    }
  }
  return { author, authorBooks };
}

const getPopular = async () => {
  const popularAuthors = await Books.aggregate([
    {
      $match: {
        ratingNumber: { $gt: 0 }
      }
    },
    {
      $project: {
        name: 1,
        photo: 1,
        categoryId: 1,
        authorId: 1,
        totalRating: 1,
        ratingNumber: 1,
        avgRate: { $divide: ["$totalRating", "$ratingNumber"] }
      }
    },
    {
      $sort: { avgRate: -1 }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: "authors",
        localField: "authorId",
        foreignField: "_id",
        as: "author"
      }
    },
    {
      $group: {
        _id: "$author._id", // group by category name
        authors: { $addToSet: "$author" } // add categories to array
      }
    },
    {
      $project: {
        _id: 0,
        authors: 1 // return only the categories array
      }
    }
  ])
  return popularAuthors;
};

module.exports = {
  create,
  update,
  deleteAuthor,
  getAuthors,
  getAuthorById,
  getPopular
}