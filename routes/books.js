const { booksController } = require('../controllers');
const { asycnWrapper } = require('../libs');

const router = require('express').Router();


router.post('/', async (req, res, next) => {
    const { body: { name, categoryId, authorId } } = req
    if (!req.file) return next(new Error('image is missing'))

    const photo = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;

    const [err, data] = await asycnWrapper(booksController.create({ name, photo, categoryId, authorId }))
    if (err) return next(err);
    res.status(201).json({ message: "success", book: data });
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    const url = `${req.protocol}://${req.headers.host}/`
    const [err, data] = await asycnWrapper(booksController.deleteBook(id, url)) 
    if (err) return next(err);
    res.status(200).json({ message: "deleted success"});
})

module.exports = router