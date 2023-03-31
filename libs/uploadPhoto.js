const multer = require('multer');
const BaseError = require('./baseError');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadImages')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(new BaseError('invalid file extension', 400));
    }
}

const upload = multer({ dest: 'uploadImages/', fileFilter, storage }).single('photo')

module.exports = upload;