const express = require('express');
const jwt = require('jwt-simple');
const User = require('./models/user');
const bcrypt = require('bcrypt');

const router = express();

const config = require('../config');


router.post('/user', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.send('Specify username or password');
  }

  User.findOne({ username: req.body.username })
    .then((userCurrent) => {
      if (userCurrent) {
        return Promise.reject('User already exists');
      }

      let hash = bcrypt.hashSync(req.body.password, 10);

      let user = new User({
        username : req.body.username,
        password : hash
      });

      return user.save();
    })
    .then(data => res.send({ success: true, data }))
    .catch(err => res.send({ success: false, err }))
});

router.get('/user', (req, res, next) => {
  if (!req.headers['x-api-key']) {
    return res.send('Not found token')
  }
  
  let username = jwt.decode(req.headers['x-api-key'], config.secretkey).username;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return Promise.reject('Incorrect username');
      }

      return user;
    })
    .then(data => res.send({ success: true, data }))
    .catch(err => res.send({ success: false, err }))
});

module.exports = router;
