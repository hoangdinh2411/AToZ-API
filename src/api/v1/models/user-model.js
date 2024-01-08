const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helpers = require('../helpers');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      ref: 'role',
      type: mongoose.Schema.Types.ObjectId,
    },
    company_name: {
      type: String,
      trim: true,
    },
    main_office: {
      type: String,
      trim: true,
    },
    office: {
      type: String,
      trim: true,
    },
    status: {
      enum: ['active', 'pending', 'banned', 'deleted'],
      type: String,
      default: 'active',
    },
    representative: {
      type: String,
      trim: true,
    },
    representative_phone: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    tax_code: {
      type: String,
      trim: true,
    },
    director: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      ref: 'category',
      type: mongoose.Schema.Types.ObjectId,
    },
    is_industrial_park: {
      type: Boolean,
      required: false,
    },
    category: {
      ref: 'category',
      type: mongoose.Schema.Types.ObjectId,
    },

    avatar: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
      trim: true,
    },
    total_product: {
      type: Number,
      default: 0,
    },
    total_transaction: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      currentTime: () => helpers.getTimeByTimezone(),
    },
  },
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.passwordEncryption = function (password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.jsonData = async function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    company_name: this.company_name,
    main_office: this.main_office,
    office: this.office,
    representative: this.representative,
    representative_phone: this.representative_phone,
    phone: this.phone,
    tax_code: this.tax_code,
    director: this.director,
    brand: this.brand,
    is_industrial_park: this.is_industrial_park,
    category: this.category,
    slug: this.slug,
    status: this.status,
    description: this.description,
  };
};

const UserModel = mongoose.model('user', userSchema, 'user');
module.exports = UserModel;
