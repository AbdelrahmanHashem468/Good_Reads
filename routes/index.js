const express = require('express');
const router = express.Router()
const author = require('./authors')
const categories = require('./categories')

router.use('/author' , author)
router.use('/categories',categories);

module.exports=router;



