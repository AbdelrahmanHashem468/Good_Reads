const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const { upload } = require('./libs');
require('dotenv').config();

const mongoUrl = process.env.mongoUrl;
mongoose.connect(mongoUrl);
const app = express();

app.use(cors());

app.use(express.json());

app.use('/uploadImages', express.static(path.join(__dirname, 'uploadImages')))

app.use(upload);
app.use(routes);

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;
  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});

const PORT = process.env.PORT;

app.listen(PORT, () => { console.log(`UP : 127.0.0.1:${PORT}`); });
