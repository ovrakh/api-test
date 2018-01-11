const router = require('express').Router();
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('./models/user');



router.post ('/login', function(req, res, next){
  console.log(config);
  if (!req.body.username || !req.body.password) {
    return res.send('Bad request')
  } else {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({username: username})
      .exec(function(err, user){
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
        // bcrypt.compare(password, user.password, function(err, valid){
        //   if (err) {
        //     return res.send('Incorrect password')
        //   }
        //   if (!valid){ return res.send('Not found')}
        //   let token = jwt.encode({username: username}, config.secretkey);
        //   res.send(token)
        // })
      })
  }
});

module.exports = router;