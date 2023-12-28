const express = require('express');
const CategoryController = require('../../controllers/admin/category-controller');
const router = express.Router();

router.post('/', CategoryController.create);
router.post('/subcategory', CategoryController.addSubcategory);
module.exports = router;
