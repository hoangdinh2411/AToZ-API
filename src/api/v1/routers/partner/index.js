const express = require('express');
const router = express.Router();
const profileRouter = require('./profile');
const productRouter = require('./product');

router.use('/profile', profileRouter);
router.use('/product', productRouter);
module.exports = router;
