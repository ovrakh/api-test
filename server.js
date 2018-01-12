const express = require('express');
const app = express();

app.use(require('./api'));

app.listen(1488, () => {
  console.log('Server up and running')
});