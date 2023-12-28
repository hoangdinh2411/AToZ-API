const express = require('express');
const router = express.Router();
const PartnerController = require('../../controllers/partner/auth-controller');
router.get('/', PartnerController.getProfile);
router.put('/', PartnerController.updateProfile);

module.exports = router;
