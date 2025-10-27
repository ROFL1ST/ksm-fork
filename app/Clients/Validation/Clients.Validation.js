const Joi = require("joi");

exports.createProductValidation = (req) => {
  let schema = Joi.object({
    name: Joi.string().allow("", null),
    phone: Joi.string().allow("", null),
    email: Joi.string().allow("", null),
    address: Joi.string().allow("", null),
    lat: Joi.string().allow("", null),
    long: Joi.string().allow("", null),
    path: Joi.string().allow("", null),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.updateProductValidation = (req) => {
  let schema = Joi.object({
    client_id: Joi.string().required(),
    name: Joi.string().allow("", null),
    phone: Joi.string().allow("", null),
    email: Joi.string().allow("", null),
    address: Joi.string().allow("", null),
    lat: Joi.string().allow("", null),
    long: Joi.string().allow("", null),
    path: Joi.string().allow("", null),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.detailProductValidation = (req) => {
  let schema = Joi.object({
    client_id: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
