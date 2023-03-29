const express = require('express');
const mongoose = require('mongoose');
// const routes = require('./routes');

const mongoUrl = process.env.mongoUrl || 'mongodb://localhost:27017/test';
mongoose.connect(mongoUrl);
const app = express();

app.use(express.json());

// app.use(routes);


const PORT = process.env.PORT || 3000 ;

app.listen(PORT, () => { console.log(`UP : localhost:${PORT}`); });
