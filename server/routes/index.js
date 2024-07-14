const express = require('express');
const router = express.Router();

router.use('/',require('./main'))
router.use('/admin/',require('./admin'))

module.exports = router