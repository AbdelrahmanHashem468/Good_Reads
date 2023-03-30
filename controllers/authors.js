const Authors = require('../models').Authors
const fs = require('fs')

const create = (data) => Authors.create(data)

const update = async (id, data, url) => {
    let author = await Authors.findById(id)
    if (!author) throw new Error('author not found')
    let newAuthor = await Authors.findByIdAndUpdate(id, data, { new: true })
    if (!newAuthor) throw new Error('error updating author')

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
    if (!author) throw new Error('author not found')
    let oldPhoto = author.photo.split(url)[1]
    if (fs.existsSync(oldPhoto)) {
        fs.unlinkSync(oldPhoto);
    }
    return author;
}
const getAuthors = () => Authors.find({})

module.exports = {
    create,
    update,
    deleteAuthor,
    getAuthors
}