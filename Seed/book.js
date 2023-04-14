
const faker = require('faker');
const { Authors, Categories } = require('../models');


async function generateBooks(num) {
    const categories = await Categories.find().select('_id');
    const authors = await Authors.find().select('_id');
    const books = [];


    for (let i = 0; i < num; i++) {
        const name = faker.lorem.sentence();
        const photo = faker.image.imageUrl();
        const categoryId = faker.random.arrayElement(categories);
        const authorId = faker.random.arrayElement(authors);
        const totalRating = faker.datatype.number({ min: 40, max: 50 });
        const ratingNumber = faker.datatype.number({ min: 10, max: 20 });
    books.push({
        name,
        photo,
        categoryId,
        authorId,
        totalRating,
        ratingNumber
    });
    }

    
    return books;
};



module.exports = generateBooks; 