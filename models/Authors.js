const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

authorSchema.plugin(mongoosePaginate);

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;