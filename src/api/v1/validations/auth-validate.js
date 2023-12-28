const yup = require('yup');
const authValidation = {
  login: yup.object().shape({
    username: yup.string('Username must be a string').required(),
    password: yup.string('Password must be a string').min(6).max(15).required(),
  }),
  register: yup.object().shape({
    username: yup.string('Username must be a string').required(),
    password: yup.string('Password must be a string').min(6).max(15).required(),
  }),
};

module.exports = authValidation;
