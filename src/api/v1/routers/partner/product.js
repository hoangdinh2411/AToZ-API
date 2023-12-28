const express = require('express');
const ProductsController = require('../../controllers/partner/product-controller');
const router = express.Router();
router.post('/', ProductsController.addProduct);

module.exports = router;
