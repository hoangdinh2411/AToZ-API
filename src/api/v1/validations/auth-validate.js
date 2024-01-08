const yup = require('yup');
const authValidation = {
  login: yup.object().shape({
    username: yup.string().required(),
    password: yup.string().min(6).max(15).required(),
  }),
  register: yup.object().shape({
    username: yup.string().required(),
    password: yup.string().min(6).max(15).required(),
    role: yup.string(),
  }),
  role: yup.object().shape({
    role_name: yup.string().required(),
    permissions: yup.array().of(yup.string()),
  }),
  permission: yup.object().shape({
    title: yup.string().required(),
  }),
};

module.exports = authValidation;
