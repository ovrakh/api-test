const router = require('express').Router();
const User = require('./models/user');
const im = require('imagemagick');
const fileUpload = require('express-fileupload');
const jwt = require('jwt-simple');
const config = require('../config');

router.use(fileUpload());

router.post('/gridFs', (req, res) => {
  if (!req.files) return res.send('No files were uploaded.');

  if (!req.headers['x-api-key']) return res.send('Token is empty.');
  let sampleFile = req.files.sampleFile;
  
  try {
  let _username = jwt.decode(req.headers['x-api-key'], config.secretkey).username;
  User.findOne({username: _username}, (err, user) => {
    if (err) {
      return res.send('Server Error')
    }
    if (!user) {
      return res.send('Unauthorized');
    }
    let id = user['_id'];
    let path = '/home/wilix/Desktop/test/img/' + id + '.jpg';
    sampleFile.mv(path, (err) => {
      if (err) return res.send(err);

      res.send('File uploaded!');
    });
    im.resize({
      srcPath: './img/' + id + '.jpg',
      dstPath: './img/' + id + '.jpg',
      width: 128
    }, (err, stdout, stderr) => {
      if (err) throw err;
      console.log('resized');
    });
  });
  } catch(err) {
    return res.send('Token not found')
  }
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