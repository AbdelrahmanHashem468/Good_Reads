const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const mongoUrl = process.env.mongoUrl || 'mongodb://localhost:27017/good_reads';
mongoose.connect(mongoUrl);
const app = express();

app.use(express.json());

app.use(routes);

app.use((error, req, res, next) => {
    if (error.message === 'Authentication failed') error.statusCode = 401;
    if (!error.statusCode) error.statusCode = 500;
    return res
      .status(error.statusCode)
      .json({ error: error.toString() });
  });

const PORT = process.env.PORT || 3000 ;

app.listen(PORT, () => { console.log(`UP : localhost:${PORT}`); });
