const multer = require('multer');
const createError = require('http-errors');

const storage = multer.memoryStorage();
const uploadImage = multer({
  dest: 'uploads/',
  storage: storage,
}).single('file');

function middlewareUpdateImage(req, res, next) {
  uploadImage(req, res, function (err) {
    if (err) {
      next(createHttpError.BadRequest(err.message));
    } else if (err) {
      next(createError.InternalServerError(err || 'Cannot upload image, please try later'));
    }
    next();
  });
}

function checkFileImage(req, res, next) {
  const { file } = req;
  if (!file) {
    return next(httpErrors.BadRequest('Please upload a file'));
  }

  if (!checkIsImage(file.mimetype)) {
    return next(new httpErrors.BadRequest('File must be an image, just accept jpg, jpeg, png'));
  }
  if (isLargeImage(file.size)) {
    return next(new httpErrors.BadRequest('Original image size must be less than 2Mb'));
  }

  next();
}

module.exports = {
  checkFileImage,
  middlewareUpdateImage,
};
