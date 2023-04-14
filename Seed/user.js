
const faker = require('faker');


const generateUsers = (num) => {
    const minDate = new Date('1950-01-01');
    const maxDate = new Date('2000-12-31');
    const user = [];


    for (let i = 0; i < num; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = '$2a$12$Wlcln2.z4QGeDcMmazmV1OaKlQPZVLSwOCPI8v81y/6.BRxZKOpnC'; //hashemhashem
    const email = faker.internet.email();
    const DOB = faker.date.between(minDate, maxDate);
    const photo = faker.image.people();

    user.push({
        firstName,
        lastName,
        password,
        DOB,
        email,
        photo,
    });
    }


    return user;
};

const user = generateUsers(10);

module.exports = user; 