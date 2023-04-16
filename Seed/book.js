
const faker = require('faker');
const { Authors, Categories, User } = require('../models');

const images = [
    'https://res.cloudinary.com/dzhd6xefm/image/upload/v1681095932/41150465_lxzgs9.jpg',
    'https://res.cloudinary.com/dzhd6xefm/image/upload/v1681096324/60784759_lwvoxm.jpg',
    'https://res.cloudinary.com/daoiadhif/image/upload/v1681548551/tess-cover_bnuote.jpg',
    'https://res.cloudinary.com/daoiadhif/image/upload/v1681548527/New-WOrld-299x449_ixgr55.webp',
    'https://res.cloudinary.com/daoiadhif/image/upload/v1681548693/e50c016f-b6a8-4666-8fb8-fe6bd5fd9fec_rw_1920_olomks.jpg',
    'https://res.cloudinary.com/daoiadhif/image/upload/v1681548528/1024w-G-7R6o-agkY_ejbl96.webp',
    'https://res.cloudinary.com/daoiadhif/image/upload/v1681548536/six-of-crows-770x1156_lj2dqv.jpg',
    'https://res.cloudinary.com/daoiadhif/image/upload/v1681548527/515HhtYN0gL_ejoa6a.webp',
    'https://res.cloudinary.com/daoiadhif/image/upload/v1681548664/tess-cover_ftanfp.jpg'
]

async function generateBooks(num) {
    const categories = await Categories.find().select('_id');
    const authors = await Authors.find().select('_id');
    const users = await User.find().select('_id');

    const books = [];


    for (let i = 0; i < num; i++) {
        const name = faker.lorem.sentence(3);
        const photo = faker.random.arrayElement(images);
        const categoryId = faker.random.arrayElement(categories);
        const authorId = faker.random.arrayElement(authors);
        const totalRating = faker.datatype.number({ min: 40, max: 50 });
        const ratingNumber = faker.datatype.number({ min: 10, max: 20 });
        const reviews=[];
        for(let i = 0; i < 5; i++){
            const userId = faker.random.arrayElement(users);
            const comment = faker.lorem.paragraphs(3);
            reviews.push({
                userId,
                comment
            });
        }
    books.push({
        name,
        photo,
        categoryId,
        authorId,
        totalRating,
        ratingNumber,
        reviews
    });
    }

    
    return books;
};



module.exports = generateBooks; 