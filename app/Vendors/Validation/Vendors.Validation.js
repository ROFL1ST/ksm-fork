const Joi = require("joi");

exports.createVendorValidation = (req) => {
  let schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    lat: Joi.string().required(),
    long: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
