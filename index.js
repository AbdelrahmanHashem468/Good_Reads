const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');
const { upload } = require('./libs');
require('dotenv').config()

const mongoUrl = process.env.mongoUrl || 'mongodb://127.0.0.1:27017/test';
mongoose.connect(mongoUrl);
const app = express();

app.use(express.json());

app.use('/uploadImages', express.static(path.join(__dirname, 'uploadImages')))
// app.use(express.static('./uploadImages'))

app.use(upload)
app.use(routes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`UP : 127.0.0.1:${PORT}`); });
