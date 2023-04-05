const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const shelfSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User'},
    books: [
        {
            bookId: { type: mongoose.Types.ObjectId, ref: 'Book', required: true },
            shelf: { type: String, enum: ['currently reading', 'read', 'want to read'], default: 'read' },
            rating: { type: Number, min:1, max:5 }
        }
    ]
}, {
    timestamps: true
})

shelfSchema.plugin(mongoosePaginate);

const Shelf = mongoose.model('Shelf', shelfSchema);
module.exports = Shelf;