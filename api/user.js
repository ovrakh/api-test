const express = require('express');
const jwt = require('jwt-simple');
const User = require('./models/user');
//const bcrypt = require('bcrypt');

const router = express();

const config = require('../config');


router.post('/user', function (req, res, next){
  let user = new User;
  user.username = req.body.username;
  user.password = req.body.password;
  user.save(function (err) {
        if (err) { res.send('Incorrect password')}
        else {
          res.send('Created')
        }
  })
});

router.get('/user', function (req, res, next) {
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
  User.findOne({username: auth.username}, function(err, user) {
    if (err) {return res.send('Incorrect username')}
    else {
      res.json(user)
    }
  })
});

module.exports = router;
