const yup = require('yup');

const profileValidation = {
  admin: yup.object().shape({
    email: yup.string().email().required(),
    company_name: yup.string().required(),
    phone: yup.string().required(),
    main_office: yup.string().required(),
    office: yup.string().required(),
    role: yup.string().strip(),
    description: yup.string().required(),
  }),
  partner: yup.object().shape({
    category: yup.string().required(),
    email: yup.string().email().required(),
    company_name: yup.string().required(),
    main_office: yup.string().required(),
    office: yup.string(),
    representative: yup.string().required(),
    representative_phone: yup.string().required(),
    phone: yup.string().required(),
    tax_code: yup.string().required(),
    director: yup.string().required(),
    brand: yup.string().required(),
    is_industrial_park: yup.boolean().required(),
    description: yup.string().required(),
    role: yup.string().strip(),
  }),
};
module.exports = profileValidation;
