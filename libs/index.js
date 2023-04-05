const BaseError = require('./baseError');
const { upload, createPhotoURL , deletePhoto} = require('./uploadPhoto');

const asycnWrapper = (promise) => promise.then((data) => [undefined, data]).catch((error) => [error]);


module.exports = {
    BaseError,
    asycnWrapper,
    upload,
    createPhotoURL,
    deletePhoto
}
