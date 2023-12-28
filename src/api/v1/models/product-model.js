const mongoose = require('mongoose');
const helpers = require('../helpers');

const colorSchema = new mongoose.Schema({
  color_name: {
    type: String,
    trim: true,
    required: true,
  },
  color_code: {
    type: String,
    trim: true,
    required: true,
  },
  images: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
});
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
    },
    monetary_unit: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    highlight_features: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    colors: [colorSchema],
    rating: {
      type: Number,
      trim: true,
      default: 0,
    },
    total_transactions: {
      type: Number,
      trim: true,
      default: 0,
    },
    short_description: {
      type: String,
      trim: true,
    },
    is_industrial_park: {
      type: Number,
      default: 0,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcategory',
    },
  },
  {
    timestamps: false,
  },
);
productSchema.pre('save', async function (next) {
  this.slug = helpers.generateSlugFrom(this.product_name);
  next();
});

productSchema.methods.jsonData = function () {
  return {
    _id: this._id,
    product_name: this.product_name,
    slug: this.slug,
    price: this.price,
    monetary_unit: this.monetary_unit,
    size: this.size,
    weight: this.weight,
    material: this.material,
    highlight_features: this.highlight_features,
    description: this.description,
    colors: this.colors,
    rating: this.rating,
    total_transactions: this.total_transactions,
    short_description: this.short_description,
    is_industrial_park: this.is_industrial_park,
    subcategory: this.subcategory,
  };
};
const ProductModel = mongoose.model('product', productSchema, 'product');
module.exports = ProductModel;
