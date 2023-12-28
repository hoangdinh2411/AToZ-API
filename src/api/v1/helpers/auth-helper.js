const jwt = require('jsonwebtoken');
const createError = require('http-errors');
let optionSecret = {
  token: process.env.JWT_SECRET,
  partner: process.env.JWT_SECRET_PARTNER,
  admin: process.env.JWT_SECRET_ADMIN,
};
const authHelper = {
  validateToken: function ({ token, type = 'token' }) {
    try {
      let result = {};

      jwt.verify(token, optionSecret[type], async function (err, decoded) {
        if (err) {
          result = { payload: null, err };
        } else {
          result = { payload: decoded };
        }
      });

      return result;
    } catch (error) {
      console.error('validateToken', error);
      return createError.Unauthorized(error.message);
    }
  },
  generateToken: async function ({ payload, type = 'token' }) {
    try {
      console.log(optionSecret[type]);
      let expiresIn = '1h';
      let options = { expiresIn };
      let token = jwt.sign(payload, optionSecret[type], options);
      return token;
    } catch (error) {
      console.log(' set token error:::', error);
      return createError.InternalServerError(error);
    }
  },
};

module.exports = authHelper;
