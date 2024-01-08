const express = require('express');
const ProductsController = require('../../controllers/partner/product-controller');
const router = express.Router();
router.get('/newest', ProductsController.getNewest);
router.get('/subcategory/:subcategory_id', ProductsController.getProductsOfSubcategory);
router.get('/:slug', ProductsController.getProductBySlug);

module.exports = router;
