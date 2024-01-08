const createHttpError = require('http-errors');
const UserModel = require('../../models/user-model');
const authValidation = require('../../validations/auth-validate');
const profileValidation = require('../../validations/profile-validate');
const helpers = require('../../helpers');
const { authHelper } = require('../../helpers/auth-helper');
const RoleModel = require('../../models/role-model');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class AdminAuthController {
  static async register(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      const role = await RoleModel.findOne({
        _id: req.body.role,
      });
      if (!role) return next(createHttpError.NotFound(ERROR_MESSAGES.ROLE.NOT_FOUND));
      let admin = new UserModel(req.body);

      admin.setPassword(req.body.password);
      await admin.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.USER.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async registerSuperAdmin(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      let admin = new UserModel(req.body);

      admin.setPassword(req.body.password);
      await admin.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.USER.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async login(req, res, next) {
    try {
      await authValidation.login.validate(req.body);
      const user = await UserModel.findOne({
        username: req.body.username,
        status: {
          $in: ['active', 'pending', 'banned'],
        },
      });
      if (!user) return next(createHttpError.BadRequest(ERROR_MESSAGES.AUTH.WRONG_USERNAME));
      if (user && user.status === 'banned')
        return next(createHttpError.NotFound(ERROR_MESSAGES.USER.BANNED));
      const isPasswordValid = user.validatePassword(req.body.password);
      if (!isPasswordValid)
        return next(createHttpError.BadRequest(ERROR_MESSAGES.AUTH.WRONG_PASSWORD));
      const token = await authHelper.generateToken({
        payload: { id: user._id, status: user.status },
      });

      await UserModel.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            token,
          },
        },
        {
          new: true,
        },
      );

      return res.status(200).json({
        success: true,
        data: {
          token,
        },
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async createPartnerAccount(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      const existing_username = await UserModel.findOne({ username: req.body.username });
      if (existing_username) return next(createHttpError.Conflict(ERROR_MESSAGES.USER.EXISTING));

      let partner = new UserModel({
        ...req.body,
        status: 'pending',
      });

      partner.setPassword(req.body.password);
      await partner.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
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
        {
          new: true,
        },
      );
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async updateProfile(req, res, next) {
    try {
      await profileValidation.admin.validate(req.body);
      const data = profileValidation.admin.cast(req.body);
      let result = await UserModel.findOneAndUpdate(
        {
          _id: req.payload.id,
        },
        {
          $set: {
            ...data,
            slug: helpers.generateSlugFrom(req.body.company_name),
            status: 'active',
          },
        },
        {
          new: true,
        },
      );
      if (!result) return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await UserModel.findOne({
        _id: req.payload.id,
        status: {
          $in: ['active', 'pending'],
        },
      })
        .populate({
          path: 'role',
          select: '-__v',
        })
        .select('-__v -password');

      if (!user) return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      const data = await user.jsonData();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = AdminAuthController;
