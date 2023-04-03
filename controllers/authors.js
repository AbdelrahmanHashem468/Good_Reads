const Authors = require('../models').Authors
const { BaseError } = require('../libs');
const Book = require('../models/Books');

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
    return author;
}

const getAuthors = async (limit,page) => {
    const authors = await Authors.paginate({}, {
        page: page || 1,
        limit: limit > 0 && limit < 10 ? limit : 10
    });
    return authors;
};

const getAuthorById = async (id) => {
    const author = await Authors.findById(id);
    if (!author) throw new BaseError('author not found', 400);
    const authorBooks = await Book.find({ authorId: author._id })
    return { author, authorBooks };
}
module.exports = {
    create,
    update,
    deleteAuthor,
    getAuthors,
    getAuthorById
}