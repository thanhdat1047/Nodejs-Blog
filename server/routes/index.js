const express = require('express');
const router = express.Router();

router.use('/',require('./main'))

module.exports = router