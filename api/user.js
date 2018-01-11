const express = require('express');
const jwt = require('jwt-simple');
const User = require('./models/user');
//const bcrypt = require('bcrypt');

const router = express();

const config = require('../config');


router.post('/user', (req, res, next) => {
  let user = new User;
  user.username = req.body.username;
  user.password = req.body.password;
  User.findOne({username: user.username}, (err, userCurrent) => {
    if (err) {
      return res.send('Incorrect username')
    }
    else {
      if (userCurrent) {
        res.send('User already exists');
      } else {
        user.save((err) => {
          if (err) res.send('Bad request');
          res.send('Created');
        })
      }
    }
  });
});

router.get('/user', (req, res, next) => {
  if(!req.headers['x-api-key']) {
    return res.send('Unauthorized')
  }
  try {
    console.log('req ', req.headers['x-api-key']);
    let auth = jwt.decode(req.headers['x-api-key'], config.secretkey);
    console.log('auth ', auth)
  } catch (err) {
    return res.send('Unauthorized')
  }
  User.findOne({username: auth.username}, (err, user) => {
    if (err) {return res.send('Incorrect username')}
    else {
      res.json(user)
    }
  })
});

module.exports = router;
