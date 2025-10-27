const Joi = require("joi");

exports.lisParameterValidation = (req) => {
  const schema = Joi.object({
    size: Joi.number().required(),
    page: Joi.number().required(),
    lookup_code: Joi.string().allow("", null),
    search: Joi.string().allow("", null),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
exports.getOneParameterValueValidation = (req) => {
  const schema = Joi.object({
    lookup_code: Joi.string().required(),
    lookup_value_code: Joi.string().required(),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
exports.createParameterValidation = (req) => {
  const schema = Joi.object({
    value: Joi.string().required(),
    lookup_code: Joi.string().required(),
    description: Joi.string().required(),
    lookup_value_code: Joi.string().required(),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
exports.updateParameterValueValidation = (req) => {
  const schema = Joi.object({
    lookup_value_id: Joi.number().required(),
    value: Joi.string().required(),
    lookup_code: Joi.string().required(),
    description: Joi.string().required(),
    lookup_value_code: Joi.string().required(),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
exports.paramLookupValidation = (req) => {
  const schema = Joi.object({
    lookup_code: Joi.string().required(),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
exports.paramLookupValueByIDValidation = (req) => {
  const schema = Joi.object({
    lookup_value_id: Joi.number().required(),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
