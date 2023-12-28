const mongoose = require('mongoose');
const helpers = require('../helpers');

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      trim: true,
      required: true,
    },
    category_slug: {
      type: String,
      unique: true,
      trim: true,
    },
    subcategories: [
      {
        ref: 'subcategory',
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: false,
  },
);
categorySchema.pre('save', async function (next) {
  this.category_slug = helpers.generateSlugFrom(this.category_name);
  next();
});

categorySchema.methods.addSubcategory = function (subcategory_id) {
  this.subcategories.push(subcategory_id);
};

const CategoryModel = mongoose.model('category', categorySchema, 'category');
module.exports = CategoryModel;
