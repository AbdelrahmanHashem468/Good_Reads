const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3
    },
    DOB: {
        type: Date,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;