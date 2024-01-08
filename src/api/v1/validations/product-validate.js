const yup = require('yup');

const imageValidation = yup.object().shape({
  url: yup.string().required(),
  public_id: yup.string().required(),
});

const colorValidation = yup.object().shape({
  color_name: yup.string().required(),
  color_code: yup.string().required(),
});

const productValidation = yup.object().shape({
  product_name: yup.string().required(),
  price: yup.number().required(),
  currency: yup.string().required(),
  size: yup.string().required(),
  weight: yup.number().required(),
  material: yup.string().required(),
  highlight_features: yup.string().required(),
  description: yup.string().required(),
  short_description: yup.string().required(),
  images: yup.array().of(imageValidation).max(4).required(),
  colors: yup.array().of(colorValidation).required(),
  subcategory: yup.string().required(),
});

module.exports = productValidation;
