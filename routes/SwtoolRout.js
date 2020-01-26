var express = require('express');

var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var usersModule = require('../modules/SwtoolModule');

//post 호출
router.post('/', (req, res, next) => {
    router.use('/', usersModule);
    next('route')
});

module.exports = router;