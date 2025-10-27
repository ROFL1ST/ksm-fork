const Joi = require("joi");

exports.loginValidation = (req) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
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

exports.registerValidation = (req) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    path: Joi.string().allow("", null),
    responsibilities_code: Joi.array().required(),
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
exports.updateValidation = (req) => {
  const schema = Joi.object({
    admin_id: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    path: Joi.string().allow("",null),
    name: Joi.string().required(),
    password: Joi.string().allow("", null),
    responsibilities_code: Joi.array().required(),
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
exports.getAccountsValidation = (req) => {
  const schema = Joi.object({
    search: Joi.string().allow("", null),
    responsibility_code: Joi.string().allow("", null),
    page: Joi.number().required(),
    size: Joi.number().required(),
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
exports.getAccountsBoosterValidation = (req) => {
  const schema = Joi.object({
    search: Joi.string().allow("", null),
    responsibility_code: Joi.string().allow("", null),
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
exports.DetailValidation = (req) => {
  const schema = Joi.object({
    admin_id: Joi.string().required(),
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
exports.RecoveryPasswordValidation = (req) => {
  const schema = Joi.object({
    password: Joi.string().required().min(6),
    conf_pass: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .label("Confirm Password")
      .messages({
        "any.only": "{{#label}} is doesn't match password",
      }),
  });

  const validate = schema.validate(req);

  if (validate.error) {
    return {
      status: false,
      code: 400,
      data: null,
      messages: validate.error.message,
    };
  }

  return { status: true };
};
