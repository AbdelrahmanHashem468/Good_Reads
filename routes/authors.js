const express = require('express');
const { authorsController } = require('../controllers');
const { asycnWrapper } = require('../libs')
const { auth, isAdmin } = require('../middlewares')
const { BaseError } = require('../libs');
const { validation, AuthorValidator } = require('../middlewares/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const authors = authorsController.getAuthors();
    const [err, data] = await asycnWrapper(authors);
    if (err) return next(err);
    res.status(200).json({ message: 'success', authors: data });
});

router.get('/:id', validation(AuthorValidator.idParam), async (req, res, next) => {
    const { id } = req.params;
    const [err, data] = await asycnWrapper(authorsController.getAuthorById(id));
    if (err) return next(err);
    res.status(200).json({ message: 'success', author: data });
})

router.use(auth);
router.use(isAdmin);

router.post('/', validation(AuthorValidator.create), async (req, res, next) => {
    const { firstName, lastName, DOB } = req.body;
    if (!req.file) return next(new BaseError('image is missing', 400))

    const photo = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;

    const author = authorsController.create({ firstName, lastName, DOB: new Date(DOB), photo });
    const [err, data] = await asycnWrapper(author);
    if (err) return next(err);
    res.status(201).json({ message: 'success', author: data });
})

router.patch('/:id', validation(AuthorValidator.update), async (req, res, next) => {
    const { body: { firstName, lastName, DOB }, params: { id } } = req;
    const photo = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : undefined;
    const url = `${req.protocol}://${req.headers.host}/`

    const author = authorsController.update({ _id: id }, { firstName, lastName, DOB, photo }, url);
    const [err, data] = await asycnWrapper(author);
    if (err) return next(err);
    res.status(200).json({ message: 'success', author: data });
})

router.delete('/:id', validation(AuthorValidator.idParam), async (req, res, next) => {
    const { id } = req.params;
    const deletedAuthor = authorsController.deleteAuthor(id, `${req.protocol}://${req.headers.host}/`)
    const [err, data] = await asycnWrapper(deletedAuthor);
    if (err) return next(err);
    res.status(200).json({ message: 'deleted' });
})

module.exports = router
