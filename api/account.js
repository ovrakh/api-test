const router = require('express').Router();
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('./models/user');

router.get('/account', (req, res, next) => {
  if (!req.headers['x-api-key']) { return res.send('Unauthorized')}
  
    let _username = jwt.decode(req.headers['x-api-key'], config.secretkey).username;
    User.findOne({username: _username})
      .then(user => {
        if (!user) {
          return Promise.reject('Unauthorized');
        }
        
        return 'Authorized!';
      })
      .then(data => res.send({ success: true, data }))
      .catch(err => res.send({ success: false, err }))
});

module.exports = router;