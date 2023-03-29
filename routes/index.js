const express = require('express');
const router = express.Router()
const author = require('./authors')

router.use('/author' , author)


module.exports = router