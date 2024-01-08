const createHttpError = require('http-errors');
const ProductModel = require('../../models/product-model');
const productValidation = require('../../validations/product-validate');
const SubcategoryModel = require('../../models/sub-category-model');
const { generateSlugFrom } = require('../../helpers');
const logHelper = require('../../helpers/log-helper');
const { ERROR_MESSAGES } = require('../../helpers/variables');

class ProductsController {
  static async add(req, res, next) {
    try {
      await productValidation.validate(req.body);
      const subcategory = SubcategoryModel.findById(req.body.subcategory);
      if (!subcategory)
        return next(createHttpError.BadRequest(ERROR_MESSAGES.SUBCATEGORY.NOT_FOUND));

      let product = new ProductModel({
        ...req.body,
        company: req.payload.id,
      });

      await product.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async getNewest(req, res, next) {
    try {
      const products = await ProductModel.find({})
        .sort({ createdAt: -1 })
        .limit(1)
        .select('slug product_name price rating images short_description');
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async getProductsOfSubcategory(req, res, next) {
    let page = 1;

    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    try {
      const products = await ProductModel.find({
        subcategory: req.params.subcategory_id,
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * 10)
        .limit(10)
        .select('slug product_name price rating images short_description');
      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      error.message = logHelper.adjustErrorMessageWhenObjectIdInvalid(error);
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async getProductById(req, res, next) {
    try {
      const product = await ProductModel.findById(req.params.product_id)
        .select('-__v')
        .populate('company', '-__v -username -password -token -role -createdAt -updatedAt -status')
        .populate('subcategory', '-__v');
      if (!product) return next(createHttpError.NotFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      error.message = logHelper.adjustErrorMessageWhenObjectIdInvalid(error);
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async getProductBySlug(req, res, next) {
    try {
      const product = await ProductModel.findOne({
        slug: req.params.slug,
      })
        .select('-__v -total_transactions')
        .populate(
          'company',
          '-__v -username -category -password -token -role -createdAt -updatedAt -status',
        );
      if (!product) return next(createHttpError.NotFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async update(req, res, next) {
    try {
      try {
        await productValidation.validate(req.body);
        const subcategory = SubcategoryModel.findById(req.body.subcategory);
        if (!subcategory)
          return next(createHttpError.BadRequest(ERROR_MESSAGES.SUBCATEGORY.NOT_FOUND));

        let product = await ProductModel.findOneAndUpdate(
          {
            _id: req.params.product_id,
            company: req.payload.id,
            status: 'active',
          },
          {
            $set: {
              ...req.body,
              slug: generateSlugFrom(req.body.product_name),
            },
          },
          {
            new: true,
            returnDocument: 'after',
          },
        );
        if (!product) return next(createHttpError.NotFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
        return res.status(200).json({
          success: true,
          data: product,
        });
      } catch (error) {
        error.message = logHelper.adjustErrorMessageWhenObjectIdInvalid(error);
        return next(createHttpError.BadRequest(error.message));
      }
    } catch (error) {}
  }

  static async delete(req, res, next) {
    try {
      await ProductModel.findByIdAndDelete(req.params.product_id);
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      error.message = logHelper.adjustErrorMessageWhenObjectIdInvalid(error);
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = ProductsController;
