const mongoose = require('mongoose');
const helpers = require('../helpers');

const colorSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: false,
  },
);

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      required: true,
    },
    public_id: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
  },
);
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
      required: true,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },
    size: {
      type: String,
      trim: true,
      required: true,
    },
    weight: {
      type: Number,
      trim: true,
      required: true,
    },
    material: {
      type: String,
      trim: true,
      required: true,
    },
    highlight_features: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
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
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcategory',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      enum: ['active', 'inactive', 'sold out'],
      type: String,
      default: 'active',
    },
    colors: [colorSchema],
    images: [imageSchema],
  },
  {
    timestamps: {
      currentTime: () => helpers.getTimeByTimezone(),
    },
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
    currency: this.monetary_unit,
    size: this.size,
    weight: this.weight,
    material: this.material,
    highlight_features: this.highlight_features,
    description: this.description,
    colors: this.colors,
    rating: this.rating,
    images: this.images,
    total_transactions: this.total_transactions,
    short_description: this.short_description,
    subcategory: this.subcategory,
  };
};
const ProductModel = mongoose.model('product', productSchema, 'product');
module.exports = ProductModel;
