const { booksController } = require('../controllers');
const { asycnWrapper, createPhotoURL } = require('../libs');
const { auth, isAdmin } = require('../middlewares')
const { BaseError } = require('../libs');
const { validation, BookValidator } = require('../middlewares/validation');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
    const [err, data] = await asycnWrapper(booksController.getBooks())
    if (err) return next(err);
    res.status(200).json({ message: 'success', books: data });
})

router.use(auth);
router.use(isAdmin);

router.post('/', validation(BookValidator.create), async (req, res, next) => {
    const { body: { name, categoryId, authorId } } = req
    if (!req.file) return next(new BaseError('image is missing', 400))

    // const photo = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;
    let photo = await createPhotoURL(`${req.file.destination}/${req.file.filename}`)
    const [err, data] = await asycnWrapper(booksController.create({ name, photo, categoryId, authorId }))
    if (err) return next(err);
    res.status(201).json({ message: "success", book: data });
});

router.delete('/:id', validation(BookValidator.delete), async (req, res, next) => {
    const { id } = req.params
    const [err, data] = await asycnWrapper(booksController.deleteBook(id))
    if (err) return next(err);
    res.status(200).json({ message: "deleted success" });
})

router.patch('/:id', validation(BookValidator.update), async (req, res, next) => {
    const { name, categoryId, authorId } = req.body;
    const { id } = req.params;
    const photo = req.file ? await createPhotoURL(`${req.file.destination}/${req.file.filename}`) : undefined;
    const [err, data] = await asycnWrapper(booksController.update({ _id: id }, { name, photo, categoryId, authorId }))
    if (err) return next(err);
    res.status(200).json({ message: "success", book: data });

})

module.exports = router