const createError = require('http-errors');
const categoryValidation = require('../../validations/category-validate');
const CategoryModel = require('../../models/category-model');
const SubcategoryModel = require('../../models/sub-category-model');
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
        return next(createError.Conflict('category-already-exists'));
      }
      return next(createError.BadRequest(error.message));
    }
  }
  static async addSubcategory(req, res, next) {
    try {
      await categoryValidation.subcategory.validate(req.body);
      const category = await CategoryModel.findOne({ _id: req.body.category_id });
      if (!category) return next(createError.NotFound('category-not-found'));
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
        return next(createError.Conflict('subcategory-already-exists'));
      }
      return next(createError.BadRequest(error.message));
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
      return next(createError.BadRequest(error.message));
    }
  }
}

module.exports = CategoryController;
