const express = require('express');
const router = express.Router();
const categoryRouter = require('./category');
const productRouter = require('./product');
router.use('/category', categoryRouter);
router.use('/product', productRouter);
module.exports = router;
