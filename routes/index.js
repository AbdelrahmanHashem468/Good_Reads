const express = require('express');
const adminRoutes = require('./admins');
const authorRoutes = require('./authors')
const bookRoutes = require('./books')
const categoryRoutes = require('./categories')
const userRoutes = require('./users')

const router = express.Router();



router.use('/admin', adminRoutes)
router.use('/author', authorRoutes)
router.use('/categories', categoryRoutes);
router.use('/book', bookRoutes);
router.use('/user', userRoutes);


module.exports = router;



