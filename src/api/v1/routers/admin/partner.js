const express = require('express');
const PartnerAuthController = require('../../controllers/partner/auth-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const router = express.Router();

router.put(
  '/profile',
  checkPermission(['PARTNER_PROFILE_READ']),
  PartnerAuthController.updateProfile,
);
module.exports = router;
