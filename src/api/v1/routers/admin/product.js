const express = require('express');
const ProductsController = require('../../controllers/partner/product-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();
router.get(
  '/:product_id',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'PARTNER_PRODUCT_READ', 'ADMIN_PRODUCT_READ']),
  ProductsController.getProductById,
);

router.post('/', checkPermission(['PARTNER_PRODUCT_CREATE']), ProductsController.add);
router.put('/:product_id', checkPermission(['PARTNER_PRODUCT_UPDATE']), ProductsController.update);
router.delete(
  '/:product_id',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'PARTNER_PRODUCT_DELETE']),
  ProductsController.delete,
);

module.exports = router;
