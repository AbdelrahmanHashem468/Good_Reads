const adminController = require('./admins') ;
const authorsController = require('./authors');
const categoriesController = require('./categories.js');
const booksController = require('./books');

module.exports={
    categoriesController,
    authorsController,
    adminController,
    booksController,
}
