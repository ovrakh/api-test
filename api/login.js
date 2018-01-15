const router = require('express').Router();
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('./models/user');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  let p = Promise.resolve({
    then: function (onFulfill, onReject) {
      if (!req.body.username || !req.body.password) {
        onReject('Specify username!');
      }
    }
  });

  p.then(User.findOne({username: req.body.username})
    .then(user => {
      if (!user) {
        return Promise.reject('Not found user')
      }

      console.log(user.password);
      console.log(bcrypt.compareSync(req.body.password, user.password));

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return Promise.reject('Not found token')
      }

      let username = req.body.username;
      return jwt.encode({username}, config.secretkey);
    })
    .then(data => res.send({success: true, data}))
    .catch(err => res.send({success: false, err}))
  )
    .catch(err => res.send({success: false, err}))
});

module.exports = router;