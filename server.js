const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/taskmanager', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
