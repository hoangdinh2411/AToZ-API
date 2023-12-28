const createError = require('http-errors');
const ProductModel = require('../../models/product-model');

class ProductsController {
  static async addProduct(req, res, next) {
    try {
      await productValidation.create.validate(req.body);
      let product = new ProductModel({
        ...req.body,
        is_industrial_park: req.payload.is_industrial_park,
      });

      await product.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createError.BadRequest(error.message));
    }
  }
}

module.exports = ProductsController;
