const Authors = require('../models').Authors

const create = (data) => Authors.create(data)
const update = (id, data) => Authors.findByIdAndUpdate(id, data, { new: true })
const getPhoto = (id)=>Authors.findById(id).select('photo')
const deleteAuthor = (id) => Authors.findByIdAndDelete(id)
const getAuthors = ()=> Authors.find({})

module.exports = {
    create,
    update,
    getPhoto,
    deleteAuthor,
    getAuthors
}