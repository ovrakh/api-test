const router = require('express').Router();
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('./models/user');

router.get('/account', function(req, res, next){
  if (!req.headers['x-api-key']) { return res.send('Unauthorized')}
  try {
    let _username = jwt.decode(req.headers['x-api-key'], config.secretkey).username;
  User.findOne({username: _username}, function(err, user){
    if (err) {
      return res.send('Server Error')
    }
    if (!user) {
      return res.send('Unauthorized');
    }
    res.send('Authorized!');
  })
  } catch(err) {
    return res.send('Unauthorized')
  }
});

module.exports = router;