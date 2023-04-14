
const faker = require('faker');


const generateCategories = (num) => {
    const categories = [];
    for (let i = 0; i < num; i++) {
    const Name = `${faker.fake('{{commerce.department}}')}${i}`;

    categories.push({
        Name
    });
    }
    return categories;
};

const categories = generateCategories(5);

module.exports = categories; 