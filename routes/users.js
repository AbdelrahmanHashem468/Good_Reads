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
    if(data.role !== 'user'){
        return next(new BaseError('Authentication failed',401));
    }

    res.status(200).json({token:data.token});
});

router.post('/signUp', validation(UsersValidator.signUp), async (req, res, next ) => {
    const { body : { firstName, lastName, email, password, DOB } } = req;
    if (!req.file) return next(new BaseError('image is missing', 400))
    const photo = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;

    const user = adminController.signUp({ firstName, lastName, email, password, DOB, photo });
    const [ error, data ] = await asycnWrapper(user);
    if(error){
        return next(error);
    }

    res.status(201).json();
});

module.exports = router;