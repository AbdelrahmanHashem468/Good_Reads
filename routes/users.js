const express = require('express');
const { adminController, shelfController } = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, UsersValidator } = require('../middlewares/validation');
const { BaseError } = require('../libs');
const { createPhotoURL } = require('../libs');
const { auth } = require('../middlewares');
const { isUser } = require('../middlewares/auth');

const router = express.Router();


router.post('/login', validation(UsersValidator.login), async (req, res, next) => {
    const { body: { email, password } } = req;
    const user = adminController.login(email, password);
    const [error, data] = await asycnWrapper(user);
    if (error) {
        return next(error);
    }
    if (data.role !== 'user') {
        return next(new BaseError('Authentication failed', 401));
    }

    res.status(200).json({ token: data.token });
});

router.post('/signUp', validation(UsersValidator.signUp), async (req, res, next) => {
    const { body: { firstName, lastName, email, password, DOB } } = req;
    if (!req.file) return next(new BaseError('image is missing', 400))
    // const photo = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;
    const photo = await createPhotoURL(`${req.file.destination}/${req.file.filename}`)
    const user = adminController.signUp({ firstName, lastName, email, password, DOB, photo });
    const [error, data] = await asycnWrapper(user);
    if (error) {
        return next(error);
    }

    res.status(201).json();
});

router.use(auth)
router.use(isUser)

router.patch('/book/:id', validation(UsersValidator.shelf), async (req, res, next) => {
    const { params: { id } } = req;
    const { body: { rating, shelf } } = req;

    const updateBook = shelfController.updateBooks({ userId: req.user._id, bookId: id, shelf, rating })
    const [error, data] = await asycnWrapper(updateBook);
    if(error) return next(error);
    res.status(200).json({data});
})

router.delete('/book/:id', validation(UsersValidator.idParam), async (req, res, next) => {
    const { params: { id } } = req;
    const updateBook = shelfController.deleteBook({ userId: req.user._id, bookId: id});
    const [error, data] = await asycnWrapper(updateBook);
    if(error) next(error);
    res.status(200).json({data});
})
module.exports = router;