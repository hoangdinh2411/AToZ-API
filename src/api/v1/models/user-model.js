const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('../helpers/variables');

const userSchema = new mongoose.Schema({
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
    enum: [ROLES.ADMIN, ROLES.PARTNER],
    required: true,
    type: String,
    default: ROLES.PARTNER,
  },
  company_name: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  mainOffice: {
    type: String,
    trim: true,
  },
  office: {
    type: String,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true,
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
  token: {
    type: String,
    trim: true,
  },
});

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.passwordEncryption = function (password) {
  return bcrypt.hashSync(password, 10);
};
userSchema.methods.saveToken = function (token) {
  this.token = token;
};

userSchema.methods.partnerDetail = async function () {
  return {
    _id: this._id,
    email: this.email,
    role: this.role,
    company_name: this.company_name,
    address: this.address,
    representative: this.representative,
    representative_phone: this.representative_phone,
    phone: this.phone,
    tax_code: this.tax_code,
    director: this.director,
    brand: this.brand,
    is_industrial_park: this.is_industrial_park,
    category: this.category,
  };
};

userSchema.methods.adminDetail = async function () {
  return {
    _id: this._id,
    username: this.username,
    role: this.role,
    company_name: this.company_name,
    email: this.email,
    phone: this.phone,
    office: this.office,
    mainOffice: this.mainOffice,
  };
};

const UserModel = mongoose.model('user', userSchema, 'user');
module.exports = UserModel;
