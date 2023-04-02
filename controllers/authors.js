const Authors = require('../models').Authors
const fs = require('fs')
const { BaseError } = require('../libs'); 

const create = (data) => Authors.create(data)

const update = async (id, data, url) => {
    let author = await Authors.findById(id)
    if (!author) throw new BaseError('author not found',400)
    let newAuthor = await Authors.findByIdAndUpdate(id, data, { new: true })
    if (!newAuthor) throw new BaseError('error updating author',500)

    if (data.photo) { //if error occurs in update, photo won't be deleted?!!
        let oldPhoto = author.photo.split(url)[1]
        if (fs.existsSync(oldPhoto)) {
            fs.unlinkSync(oldPhoto);
        }
    }
    return newAuthor;
}

const deleteAuthor = async (id, url) => {
    let author = await Authors.findByIdAndDelete(id)
    if (!author) throw new BaseError('author not found',400)
    let oldPhoto = author.photo.split(url)[1]
    if (fs.existsSync(oldPhoto)) {
        fs.unlinkSync(oldPhoto);
    }
    return author;
}
const getAuthors = () => Authors.find({})

const getAuthorById = async(id) => {
    const author = await Authors.findById(id);
    if (!author) throw new BaseError('author not found',400);
    return author;
}
module.exports = {
    create,
    update,
    deleteAuthor,
    getAuthors,
    getAuthorById
}