const authMiddleware = require('../middlewares/auth-middleware');
const clientRouter = require('./client');
const adminRouter = require('./admin');
const partnerRouter = require('./partner');
const adminAuthRouter = require('./admin/auth');
const mediaRouter = require('./admin/media');
module.exports = function (app) {
  app.use('/', clientRouter);

  app.use('/admin', adminAuthRouter);
  app.use('/admin', authMiddleware.admin);
  app.use('/admin', adminRouter);

  app.use('/partner', authMiddleware.partner);
  app.use('/partner', partnerRouter);

  app.use('/media', authMiddleware.optional);
  app.use('/media', mediaRouter);

  app.use('/test', (req, res) => {
    return res.status(200).json({ message: 'test success' });
  });
};
