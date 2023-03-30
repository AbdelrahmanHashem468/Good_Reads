const adminController = require('./admins') ;
const authorsController = require('./authors');
const categoriesController = require('./categories');
const booksController = require('./books');

module.exports={
    categoriesController,
    authorsController,
    adminController,
    booksController,
}
