const express = require('express');
const { adminController } = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, UsersValidator } = require('../middlewares/validation');
const { BaseError } = require('../libs'); 

const router = express.Router();


router.post('/login', validation(UsersValidator.login), async (req, res, next ) => {
    const { body : { email, password } } = req;
    const user = adminController.login(email, password);
    const [ error, data ] = await asycnWrapper(user);
    if(error){
        return next(error);
    }
    if(data.role !== 'admin'){
        return next(new BaseError('Authentication failed',401));
    }

    res.status(200).json({token:data.token});
});

module.exports = router;