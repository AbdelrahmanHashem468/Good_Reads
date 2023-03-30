const express = require('express');
const adminRoutes = require('./admins');
const author = require('./authors')
const book = require('./books')
const categories = require('./categories')

const router = express.Router();



router.use('/admin', adminRoutes)
router.use('/author', author)
router.use('/categories', categories);
router.use('/book', book);

module.exports = router;



