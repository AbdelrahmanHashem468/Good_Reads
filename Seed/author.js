
const faker = require('faker');


const generateAuthors = (num) => {
    const minDate = new Date('1950-01-01');
    const maxDate = new Date('2000-12-31');
    const authors = [];


    for (let i = 0; i < num; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const DOB = faker.date.between(minDate, maxDate);
    const photo = faker.image.people();

    authors.push({
        firstName,
        lastName,
        DOB,
        photo,
    });
    }


    return authors;
};

const author = generateAuthors(10);

module.exports = author; 