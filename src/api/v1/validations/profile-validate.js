const yup = require('yup');

const profileValidation = {
  admin: yup.object().shape({}),
  partner: yup.object().shape({
    category: yup.string('Category must be a string').required(),
    email: yup.string('Email must be a string').email().required(),
    company_name: yup.string('Company name must be a string').required(),
    address: yup.string('Address must be a string').required(),
    representative: yup.string('Representative must be a string').required(),
    representative_phone: yup.string('Representative phone must be a string').required(),
    sales_phone: yup.string('Sales phone must be a string').required(),
    tax_code: yup.string('Tax code must be a string').required(),
    director: yup.string('Director must be a string').required(),
    brand: yup.string('Brand must be a string').required(),
    is_industrial_park: yup.boolean('Is industrial park field must be true or false').required(),
  }),
};
module.exports = profileValidation;
