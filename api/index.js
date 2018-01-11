const bodyParser = require('body-parser');
const router = require('express').Router();

router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: false }));

router.use(require('./user'));
router.use(require('./login'));
router.use(require('./account'));
router.use(require('./gridFs'));

module.exports = router;