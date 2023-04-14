
const faker = require('faker');
const { User, Books, Categories } = require('../models');


async function generateshelves() {
    const users = await User.find().select('_id');
    const booksID = await Books.find().select('_id');

    const shelves = [];


    for (let i = 0; i < users.length; i++) {
        const userId = users[i];
        const books=[];
        for(let i = 0; i < 5; i++){
            const bookId = faker.random.arrayElement(booksID);
            const shelf = faker.random.arrayElement(['currently reading', 'read', 'want to read']);
            const rating = faker.datatype.number({ min: 1, max: 5 });
            books.push({
                bookId,
                shelf,
                rating
            });
        }
        shelves.push({
        userId,
        books
    });
    }
    return shelves;
};


module.exports = generateshelves; 