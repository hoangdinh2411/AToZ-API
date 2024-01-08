const createHttpError = require('http-errors');
const RoleModel = require('../../models/role-model');
const authValidation = require('../../validations/auth-validate');
const PermissionModel = require('../../models/permission-model');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class RoleController {
  static async createSuperAdminRole(req, res, next) {
    try {
      let role = new RoleModel({
        role_name: 'super_admin',
        permissions: ['659324ab746734213a2340f7'],
      });
      await role.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.ROLE.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async create(req, res, next) {
    try {
      await authValidation.role.validate(req.body);

      const permissions = await PermissionModel.find({
        _id: { $in: req.body.permissions },
      });

      if (permissions.length !== req.body.permissions.length)
        return next(createHttpError.NotFound(ERROR_MESSAGES.ROLE.PERMISSIONS_LIST_INVALID));
      let role = new RoleModel(req.body);
      await role.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.ROLE.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async getAll(req, res, next) {
    try {
      let roles = await RoleModel.find({}).select('-__v ');

      if (!roles) roles = [];
      return res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = RoleController;
