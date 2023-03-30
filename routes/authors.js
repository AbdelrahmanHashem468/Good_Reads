const express = require('express');
const { authorsController } = require('../controllers');
const router = express.Router();
const { asycnWrapper } = require('../libs');


router.post('/', async (req, res, next) => {
    const { firstName, lastName, DOB } = req.body;
    if (!req.file) return next(new Error('image is missing'))

    const photo = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;

    const author = authorsController.create({ firstName, lastName, DOB: new Date(DOB), photo });
    const [err, data] = await asycnWrapper(author);
    if (err) return next(err);
    res.status(201).json({ message: 'success', author: data });
})

router.patch('/:id', async (req, res, next) => {
    const { body: { firstName, lastName, DOB }, params: { id } } = req;
    const photo = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : undefined;
    const url = `${req.protocol}://${req.headers.host}/`

    const author = authorsController.update({ _id: id }, { firstName, lastName, DOB, photo }, url);
    const [err, data] = await asycnWrapper(author);
    if (err) return next(err);
    res.status(200).json({ message: 'success', author: data });
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const deletedAuthor = authorsController.deleteAuthor(id, `${req.protocol}://${req.headers.host}/`)
    const [err, data] = await asycnWrapper(deletedAuthor);
    if (err) return next(err);
    res.status(200).json({ message: 'deleted' });
})

router.get('/', async (req, res, next) => {
    const authors = authorsController.getAuthors();
    const [err, data] = await asycnWrapper(authors);
    if (err) return next(err);
    res.status(200).json({ message: 'success', authors: data });
})

module.exports = router
