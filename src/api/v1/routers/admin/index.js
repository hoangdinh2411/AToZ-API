const express = require('express');
const router = express.Router();
const partnerRouter = require('./partner');
const categoryRouter = require('./category');

router.use('/partner', partnerRouter);
router.use('/category', categoryRouter);

module.exports = router;
