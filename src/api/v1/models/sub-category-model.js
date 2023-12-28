const mongoose = require('mongoose');
const helpers = require('../helpers');

const subcategorySchema = new mongoose.Schema(
  {
    subcategory_name: {
      type: String,
      trim: true,
    },
    subcategory_slug: {
      type: String,
      unique: true,
      trim: true,
    },
    category: {
      ref: 'category',
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: false,
  },
);

subcategorySchema.pre('save', async function (next) {
  this.subcategory_slug = helpers.generateSlugFrom(this.subcategory_name);
  next();
});
subcategorySchema.methods.jsonData = async function () {
  return {
    _id: this._id,
    subcategory_name: this.subcategory_name,
    subcategory_slug: this.subcategory_slug,
    category: this.category,
  };
};

const SubcategoryModel = mongoose.model('subcategory', subcategorySchema, 'subcategory');
module.exports = SubcategoryModel;
