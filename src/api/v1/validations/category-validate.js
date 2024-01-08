const yup = require('yup');

const categoryValidation = {
  category: yup.object().shape({
    category_name: yup.string().required(),
  }),
  subcategory: yup.object().shape({
    subcategory_name: yup.string().required(),
    category_id: yup.string().required(),
  }),
};
module.exports = categoryValidation;
