const createError = require('http-errors');
const { ROLES } = require('../helpers/variables');
const UserModel = require('../models/user-model');
const authHelper = require('../helpers/auth-helper');

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    let token = authorization.split(' ')[1];
    req.token = token;
    return token;
  }
  return null;
};

const validateAdmin = async (id, token) => {
  try {
    return await UserModel.findOne({
      _id: id,
      role: ROLES.ADMIN,
      token,
    }).select('-password');
  } catch (error) {
    console.log('validateAdmin error:::', error);
    return null;
  }
};
const validatePartner = async (id, token) => {
  try {
    return await UserModel.findOne({
      _id: id,
      status: 1,
      role: ROLES.PARTNER,
      token,
    }).select('-password');
  } catch (error) {
    console.log('validatePartner error:::', error);
    return null;
  }
};

const authMiddleware = {
  optional: async function (req, res, next) {
    let token = getTokenFromHeaders(req);
    if (!token) return next(createError.Unauthorized('missing-token'));
    const payload = await UserModel.findOne({ token });
    if (!payload) return next(createError.Unauthorized('invalid-token'));
    req.payload = payload;
    next();
  },
  admin: async function (req, res, next) {
    let token = getTokenFromHeaders(req);
    if (!token) return next(createError.Unauthorized('missing-token'));
    let { payload, err } = authHelper.validateToken({ token, type: ROLES.ADMIN });
    if (err) return next(createError.Unauthorized(err.message));
    let admin = await validateAdmin(payload.id, token);
    if (!admin) return next(createError.Unauthorized('invalid-token'));
    req.payload = payload;
    next();
  },
  partner: async function (req, res, next) {
    let token = getTokenFromHeaders(req);
    if (!token) return next(createError.Unauthorized('missing-token'));
    let { payload, err } = authHelper.validateToken({ token, type: ROLES.PARTNER });
    if (err) return next(createError.Unauthorized(err.message));
    let partner = await validatePartner(payload.id, token);
    if (!partner) return next(createError.Unauthorized('invalid-token'));
    req.payload = payload;
    next();
  },
};

module.exports = authMiddleware;
