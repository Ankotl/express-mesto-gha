const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62efe49f4c4201b3094f0ed3',
  };

  next();
});
app.use(router);
app.listen(PORT);
