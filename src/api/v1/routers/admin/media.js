const express = require('express');
const { uploadCloud } = require('../../../../plugins/upload-plugin');
const MediaController = require('../../controllers/admin/media-controller');
const router = express.Router();

// router.post("/media/cloud", uploadCloud.single("file"), MediaController.cloudSingle);
router.post('/images/upload', uploadCloud.array('image'), MediaController.upload);

module.exports = router;
