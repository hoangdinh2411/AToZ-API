const express = require('express');
const AdminAuthController = require('../../controllers/admin/auth-controller');
const authMiddleware = require('../../middlewares/auth-middleware');
const router = express.Router();

router.post('/login', AdminAuthController.login);
router.post('/register', AdminAuthController.register);
router.post('/partner', authMiddleware.admin, AdminAuthController.createPartnerAccount);
router.get('/logout', authMiddleware.optional, AdminAuthController.logout);

module.exports = router;
