const express = require('express');
const adminRoutes = require('./admins');
const router = express.Router();

router.use('/admin',adminRoutes)








module.exports = router;