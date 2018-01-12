const router = require('express').Router();
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('./models/user');

router.post ('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.send('Bad request')
  }

  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return Promise.reject('Not found user')
      }

      if (req.body.password !== user.password) {
        return Promise.reject('Not found token')
      }

      let username = req.body.username;
      return jwt.encode({ username }, config.secretkey);
    })
    .then(data => res.send({ success: true, data }))
    .catch(err => res.send({ success: false, err }))
});

module.exports = router;