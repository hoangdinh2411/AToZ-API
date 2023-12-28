const createError = require('http-errors');
const profileValidation = require('../../validations/profile-validate');
const { generateSlugFrom } = require('../../helpers');
const UserModel = require('../../models/user-model');
class PartnerAuthController {
  static async updateProfile(req, res, next) {
    try {
      await profileValidation.partner.validate(req.body);
      let result = await UserModel.findOneAndUpdate(
        { _id: req.payload.id },
        {
          $set: {
            ...req.body,
            slug: generateSlugFrom(req.body.company_name),
          },
        },
        {
          new: true,
        },
      );
      if (!result) return next(createError.NotFound('partner-not-found'));
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createError.BadRequest(error.message));
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await UserModel.findOne({ _id: req.payload.id });

      if (!user) return next(createError.NotFound('partner-not-found'));
      const data = await user.partnerDetail();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(createError.BadRequest(error.message));
    }
  }
}

module.exports = PartnerAuthController;
