const express = require('express');
const { authorsController } = require('../controllers');
const router = express.Router();
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)


router.post('/', async (req, res, next) => {
    const { firstName, lastName, DOB } = req.body;
    try {
        if (!req.file) throw new Error('image is missing');
        const photo = `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`;
        const author = await authorsController.create({ firstName, lastName, DOB: Date(DOB), photo });
        if (author) res.status(201).json({ message: 'success', author });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.patch('/:id', async (req, res, next) => {
    const { firstName, lastName, DOB } = req.body;
    const { id } = req.params;
    try {
        const photo = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : undefined;
        if (photo) {
            oldPhoto = await authorsController.getPhoto(id);
            await unlinkAsync(oldPhoto.photo.split(`${req.protocol}://${req.headers.host}/`)[1])
        }
        const author = await authorsController.update({ _id: id }, { firstName, lastName, DOB: Date(DOB), photo });
        res.status(201).json({ message: 'success', author });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedAuthor = await authorsController.deleteAuthor(id);
        await unlinkAsync(deletedAuthor.photo.split(`${req.protocol}://${req.headers.host}/`)[1]);
        if (!deletedAuthor) throw new Error('User not found');
        res.status(200).json({ message: 'deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/', async (req, res, next) => {
    try {
        const authors = await authorsController.getAuthors();
        res.status(200).json({ message: 'success', authors });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router
