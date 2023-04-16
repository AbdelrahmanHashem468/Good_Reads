const mongoose = require('mongoose');
const { User, Authors, Categories, Books, Shelf } = require('../models');
const { users, authors, categories, books ,shelves} = require('./index');
require('dotenv').config();

const mongoUrl = process.env.mongoUrl;
console.log(mongoUrl);
mongoose.connect(mongoUrl);



// (async() => {
//     await User.deleteMany({});
//     User.insertMany(users)
//     .then(docs => console.log(`${docs.length} users have been inserted into the database.`))
//     .catch(err => {
//         console.error(err);
//     });
// })();


// (async() => {
//     await Authors.deleteMany({});
//     Authors.insertMany(authors)
//     .then(docs => console.log(`${docs.length} authors have been inserted into the database.`))
//     .catch(err => {
//         console.error(err);
//     });
// })();

// (async() => {
//     await Categories.deleteMany({});
//     Categories.insertMany(categories)
//     .then(docs => console.log(`${docs.length} categories have been inserted into the database.`))
//     .catch(err => {
//         console.error(err);
//     });
// })();


// (async() => {
//     await Books.deleteMany({});
//     const data =  await books(50);
//     Books.insertMany(data)
//     .then(docs => console.log(`${docs.length} books have been inserted into the database.`))
//     .catch(err => {
//         console.error(err);
//     });
// })();


// (async() => {
//     await Shelf.deleteMany({});
//     const data =  await shelves();
//     Shelf.insertMany(data)
//     .then(docs => console.log(`${docs.length} shelves have been inserted into the database.`))
//     .catch(err => {
//         console.error(err);
//     });
// })();