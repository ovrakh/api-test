const fs = require('fs');
const router = require('express').Router();
const User = require('./models/user');
const im = require('imagemagick');
const fileUpload = require('express-fileupload');
const jwt = require('jwt-simple');
const config = require('../config');

// default options
router.use(fileUpload());

router.post('/gridFs', function(req, res) {

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  let user = new User;
  let _username = req.headers.username;
  User.findOne({username: _username}, function (err, user) {
    let id = user['_id'];
    let path = '/home/wilix/Desktop/test/img/' + id + '.jpg';

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path, function (err) {
      if (err)
        return res.status(500).send(err);

      res.send('File uploaded!');
    });
    im.resize({
      srcPath: './img/' + id + '.jpg',
      dstPath: './img/' + id + '.jpg',
      width: 128,
      progressive: true
    }, function (err, stdout, stderr) {
      if (err) throw err;
      console.log('resized kittens.jpg to fit within 256x256px');
    });
  });
});

router.get('/gridFs', function (req, res, next) {
  if(!req.headers['x-api-key']) {
    return res.send('Unauthorized')
  }
  try {
    console.log('req ', req.headers['x-api-key']);
    let auth = jwt.decode(req.headers['x-api-key'], config.secretkey);
    console.log('auth ', auth);
  User.findOne({username: auth.username}, function(err, user) {
    if (err) {return res.send('Incorrect username')}
    else {
      res.download('./img/' + user['_id'] + '.jpg');
    }
  })
  } catch (err) {
    return res.send('Unauthorized')
  }
});






    /* imageMagick.convert([path, '-resize', '128x128', path],
       function(err, stdout){
         if (err) throw err;
         console.log('stdout:', stdout);
       });*/



module.exports = router;