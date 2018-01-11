const router = require('express').Router();
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('./models/user');

router.post ('/login', (req, res, next) => {
  console.log(config);
  if (!req.body.username || !req.body.password) {
    return res.send('Bad request')
  } else {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({username: username})
      .exec((err, user) => {
        if (err) {
          return res.send('Incorrect username')
        }
        if (!user) {return res.sendStatus(401)} else {
          if (password === user.password) {
            let token = jwt.encode({username: username}, config.secretkey);
            res.send(token);
          } else {
            return res.send('Not found token')
          }
        }
      })
  }
});

module.exports = router;