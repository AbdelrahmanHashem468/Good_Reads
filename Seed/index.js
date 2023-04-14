const users = require('./user');
const categories=require('./category');
const authors = require('./author')
const books = require('./book')
const shelves = require('./Shelf');
module.exports = {
    authors,
    categories,
    users,
    books,
    shelves
}