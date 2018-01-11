const fs = require('fs');
const router = require('express').Router();
const User = require('./models/user');
const im = require('imagemagick');
const fileUpload = require('express-fileupload');
const jwt = require('jwt-simple');
const config = require('../config');

router.use(fileUpload());

router.post('/gridFs', (req, res) => {
  
  let sampleFile = req.files.sampleFile;

  let user = new User;
  let _username = req.headers.username;
  User.findOne({username: _username}, (err, user) => {
    let id = user['_id'];
    let path = '/home/wilix/Desktop/test/img/' + id + '.jpg';
    
    sampleFile.mv(path, (err) => {
      if (err)
        return res.status(500).send(err);

      res.send('File uploaded!');
    });
    im.resize({
      srcPath: './img/' + id + '.jpg',
      dstPath: './img/' + id + '.jpg',
      width: 128,
      progressive: true
    }, (err, stdout, stderr) => {
      if (err) throw err;
      console.log('resized kittens.jpg to fit within 256x256px');
    });
  });
});

router.get('/gridFs', (req, res, next) => {
  if(!req.headers['x-api-key']) {
    return res.send('Unauthorized')
  }
  try {
    console.log('req ', req.headers['x-api-key']);
    let auth = jwt.decode(req.headers['x-api-key'], config.secretkey);
    console.log('auth ', auth);
  User.findOne({username: auth.username}, (err, user) => {
    if (err) {return res.send('Incorrect username')}
    else {
      res.download('./img/' + user['_id'] + '.jpg');
    }
  })
  } catch (err) {
    return res.send('Unauthorized')
  }
});

module.exports = router;