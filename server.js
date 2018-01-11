const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/form.html');
});

app.use(require('./api'));

app.listen(1488, function() {
  console.log('Server up and running')
});