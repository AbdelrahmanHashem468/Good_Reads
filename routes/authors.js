const express = require('express');
const { authorsController } = require('../controllers');
const { asycnWrapper } = require('../libs')
const { auth, isAdmin } = require('../middlewares')
const { BaseError } = require('../libs');
const { validation, AuthorValidator } = require('../middlewares/validation');
const { createPhotoURL } = require('../libs');
const { authUser } = require('../middlewares/auth');

const router = express.Router();

router.get('/popular', async (req, res, next) => {
    const [err, data] = await asycnWrapper(authorsController.getPopular())
    if (err) return next(err);
    res.status(200).json({ message: 'success', authors: data });
});

router.get('/', async (req, res, next) => {
    const limit = parseInt(req.query.limit);
    const page  = parseInt(req.query.page);
    const authors = authorsController.getAuthors(limit,page);
    const [err, data] = await asycnWrapper(authors);
    if (err) return next(err);
    res.status(200).json({ message: 'success', authors: data });
});

router.get('/:id', validation(AuthorValidator.idParam), async (req, res, next) => {
    const { id } = req.params;
    const { headers: { authorization } } = req;
    let userId = null
    if (authorization) {
        const user = await authUser(authorization)
        if (user) userId = user._id
    }
    const [err, data] = await asycnWrapper(authorsController.getAuthorById(id, userId));
    if (err) return next(err);
    res.status(200).json({ message: 'success', author: data });
})

router.use(auth);
router.use(isAdmin);

router.post('/', validation(AuthorValidator.create), async (req, res, next) => {
    const { firstName, lastName, DOB } = req.body;
    if (!req.file) return next(new BaseError('image is missing', 400))
    let photo = await createPhotoURL(`${req.file.destination}/${req.file.filename}`)
    const author = authorsController.create({ firstName, lastName, DOB: new Date(DOB), photo });
    const [err, data] = await asycnWrapper(author);
    if (err) return next(err);
    res.status(201).json({ message: 'success', author: data });
})

router.patch('/:id', validation(AuthorValidator.update), async (req, res, next) => {
    const { body: { firstName, lastName, DOB }, params: { id } } = req;

    const photo = req.file ? await createPhotoURL(`${req.file.destination}/${req.file.filename}`) : undefined;

    const author = authorsController.update({ _id: id }, { firstName, lastName, DOB, photo });
    const [err, data] = await asycnWrapper(author);
    if (err) return next(err);
    res.status(200).json({ message: 'success', author: data });
})

router.delete('/:id', validation(AuthorValidator.idParam), async (req, res, next) => {
    const { id } = req.params;
    const deletedAuthor = authorsController.deleteAuthor(id)
    const [err, data] = await asycnWrapper(deletedAuthor);
    if (err) return next(err);
    res.status(200).json({ message: 'deleted' });
})

module.exports = router
