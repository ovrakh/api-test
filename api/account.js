const router = require('express').Router();
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('./models/user');

router.get('/account', (req, res) => {
  Promise.resolve()
    .then(() => {
      if (!req.headers['x-api-key']) return Promise.reject('Unauthorized');
    })
    .then(() => {
      let username = jwt.decode(req.headers['x-api-key'], config.secretkey).username;
      return User.findOne({ username })
        .then(user => {
          if (!user) {
            return Promise.reject('Unauthorized');
          }

          return 'Authorized!';
        })
    })
    .then(data => res.send({ success: true, data }))
    .catch(err => res.send({ success: false, err }))
});

module.exports = router;