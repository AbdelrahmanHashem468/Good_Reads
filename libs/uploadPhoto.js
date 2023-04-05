const multer = require('multer');
const BaseError = require('./baseError');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const createPhotoURL = async (url) => {
    let photo = await cloudinary.uploader.upload(url, {
        resource_type: "image"
    }).then((result) => {
        fs.unlinkSync(url)
        return result.secure_url
    })
        .catch(err => { console.log(err); })
 
    return photo;
}

const deletePhoto = async (url) => {
    cloudinary.uploader.destroy(url,{ resource_type: 'image'})
        .then(result=>console.log(result));
}

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

module.exports = { upload, createPhotoURL ,deletePhoto };