const yup = require('yup');

const categoryValidation = {
  category: yup.object().shape({
    category_name: yup.string('Name must be a string').required(),
  }),
  subcategory: yup.object().shape({
    subcategory_name: yup.string('Name must be a string').required(),
    category_id: yup.string('Category id must be a string').required(),
  }),
};
module.exports = categoryValidation;
