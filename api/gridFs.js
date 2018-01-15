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
    let username = jwt.decode(req.headers['x-api-key'], config.secretkey).username;

    User.findOne({ username })
        .then(user => {
            if (!user) {
                return Promise.reject('Unauthorized');
            }
            let path = `./images/${user['_id']}.jpg`;
            sampleFile.mv(path)
                .then(() => {
                    return ('File uploaded!');
                });
            im.resize({
                srcPath: `./images/${user['_id']}.jpg`,
                dstPath: `./images/${user['_id']}.jpg`,
                width: 128
            })
                .then(() => {
                    console.log('Resized');
                })
                .then(data => res.send({ success: true, data }))
                .catch(err => res.send({ success: false, err }))
        });
});

router.get('/gridFs', (req, res, next) => {
    if(!req.headers['x-api-key']) {
    return res.send('Unauthorized')
    }
    let username = jwt.decode(req.headers['x-api-key'], config.secretkey).username;
    User.findOne({ username })
        .then(user => {
          if (!user) {
              return Promise.reject('Not found user');
          }

          res.download('./img/' + user['_id'] + '.jpg');
        })
        .then(data => res.send({ success: true, data }))
        .catch(err => res.send({ success: false, err }))
});

module.exports = router;