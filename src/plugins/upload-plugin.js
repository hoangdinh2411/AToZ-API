const fs = require('fs');
const createHttpError = require('http-errors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});
const uploadImage = multer({
  dest: 'uploads/',
  fileFilter: async (req, file, cb) => {
    console.log('uploadImage', req.file);
    console.log('uploadImage', file);
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype))
      return cb(new Error('incorrect-file-format'), false);
    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 30,
    files: 1,
  },
}).single('image');

function middlewareUploadImage(req, res, next) {
  uploadImage(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log('middlewareUploadImage', err);
      next(createHttpError.BadRequest(err.message));
    } else if (err) {
      next(createHttpError.InternalServerError(err || 'Cannot upload image, please try later'));
    }
    next();
  });
}

module.exports = { middlewareUploadImage, uploadImage, cloudinary };
