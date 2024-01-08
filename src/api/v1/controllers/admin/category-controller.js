const createHttpError = require('http-errors');
const categoryValidation = require('../../validations/category-validate');
const CategoryModel = require('../../models/category-model');
const SubcategoryModel = require('../../models/sub-category-model');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class CategoryController {
  static async create(req, res, next) {
    try {
      await categoryValidation.category.validate(req.body);
      let category = new CategoryModel(req.body);
      await category.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.CATEGORY.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async addSubcategory(req, res, next) {
    try {
      await categoryValidation.subcategory.validate(req.body);
      const category = await CategoryModel.findOne({ _id: req.body.category_id });
      if (!category) return next(createHttpError.NotFound(ERROR_MESSAGES.CATEGORY.NOT_FOUND));
      let subcategory = new SubcategoryModel({
        subcategory_name: req.body.subcategory_name,
        category: req.body.category_id,
      });
      await subcategory.save();
      category.addSubcategory(subcategory._id);
      await category.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.SUBCATEGORY.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async getAll(req, res, next) {
    try {
      let categories = await CategoryModel.find({})
        .select('-__v')
        .populate('subcategories', '-__v');
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = CategoryController;
