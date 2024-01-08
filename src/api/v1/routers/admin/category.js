const express = require('express');
const CategoryController = require('../../controllers/admin/category-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();

router.post(
  '/',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_CATEGORY_CREATE']),
  CategoryController.create,
);
router.post(
  '/subcategory',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_SUBCATEGORY_CREATE']),
  CategoryController.addSubcategory,
);
module.exports = router;
