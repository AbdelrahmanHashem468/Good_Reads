const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const booksSchema = new mongoose.Schema(
{
    name:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    authorId:{
        type: mongoose.Types.ObjectId,
        ref: 'Author'
    },
    totalRating:{
        type: Number,
        default: 0
    },
    ratingNumber:{
        type: Number,
        default: 0
    },
    reviews: [
        {
            userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String},
        }
    ]
},
{
    timestamps: true, 
}
)

const virtual = booksSchema.virtual('avgRate');
virtual.get(function(value, virtual, doc) {
    return Number((this.totalRating/this.ratingNumber).toFixed(1));
});

booksSchema.set('toJSON', {
    virtuals: true, 
    transform: function (doc, ret) {
        delete ret.totalRating;
        // delete ret.ratingNumber;
        delete ret.id;
    },
});


booksSchema.plugin(mongoosePaginate);

const Book = mongoose.model('Book', booksSchema)

module.exports = Book