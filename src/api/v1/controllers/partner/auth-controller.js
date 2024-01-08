const createHttpError = require('http-errors');
const profileValidation = require('../../validations/profile-validate');
const { generateSlugFrom } = require('../../helpers');
const UserModel = require('../../models/user-model');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class PartnerAuthController {
  static async updateProfile(req, res, next) {
    try {
      await profileValidation.partner.validate(req.body);
      const data = profileValidation.partner.cast(req.body);
      let result = await UserModel.findOneAndUpdate(
        {
          _id: req.payload.id,
        },
        {
          $set: {
            ...data,
            slug: generateSlugFrom(req.body.company_name),
            status: 'active',
          },
        },
        {
          new: true,
        },
      )
        .select('-password -__v -token')
        .populate('role', '-__v');
      if (!result) return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = PartnerAuthController;
