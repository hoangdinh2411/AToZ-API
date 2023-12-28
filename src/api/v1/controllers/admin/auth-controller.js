const createError = require('http-errors');
const authHelper = require('../../helpers/auth-helper');
const { ROLES } = require('../../helpers/variables');
const UserModel = require('../../models/user-model');
const authValidation = require('../../validations/auth-validate');
class AdminAuthController {
  static async register(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      let admin = new UserModel({
        ...req.body,
        role: ROLES.ADMIN,
      });

      admin.setPassword(req.body.password);
      await admin.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createError.Conflict('username-already-exists'));
      }
      return next(createError.BadRequest(error.message));
    }
  }
  static async login(req, res, next) {
    try {
      await authValidation.login.validate(req.body);

      const user = await UserModel.findOne({ username: req.body.username, status: 1 });

      if (!user) return next(createError.NotFound('invalid-username'));
      const isPasswordValid = user.validatePassword(req.body.password);
      if (!isPasswordValid) return next(createError.Unauthorized('invalid-password'));
      const token = await authHelper.generateToken({
        payload: { id: user._id, status: user.status },
        type: user.role,
      });

      user.saveToken(token);
      await user.save();
      return res.status(200).json({
        success: true,
        token,
      });
    } catch (error) {
      return next(createError.BadRequest(error.message));
    }
  }

  static async createPartnerAccount(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      const existing_username = await UserModel.findOne({ username: req.body.username });
      if (existing_username) return next(createError.Conflict('username-already-exists'));

      let partner = new UserModel(req.body);

      partner.setPassword(req.body.password);
      await partner.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createError.BadRequest(error.message));
    }
  }

  static async logout(req, res, next) {
    try {
      await UserModel.findOneAndUpdate(
        { _id: req.payload.id },
        {
          $set: {
            token: '',
          },
        },
      );
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createError.BadRequest(error.message));
    }
  }
}

module.exports = AdminAuthController;
