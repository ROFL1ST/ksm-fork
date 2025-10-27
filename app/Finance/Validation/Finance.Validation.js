const Joi = require("joi");

exports.createFinanceValidation = (req) => {
  let schema = Joi.object({
    finance_code: Joi.string().required(),
    input_date: Joi.string().required(),
    description: Joi.string().required(),
    category_code: Joi.string().required(),
    total: Joi.number().required(),
    status_code: Joi.string().required(),
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
exports.updateFinanceValidation = (req) => {
  let schema = Joi.object({
    finance_id: Joi.number().required(),
    finance_code: Joi.string().required(),
    input_date: Joi.string().required(),
    description: Joi.string().required(),
    category_code: Joi.string().required(),
    total: Joi.number().required(),
    status_code: Joi.string().required(),
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
exports.getFinanceValidation = (req) => {
  let schema = Joi.object({
    size: Joi.number().required(),
    page: Joi.string().required(),
    finance_code: Joi.string().allow("", null),
    search: Joi.string().allow("", null),
    status_code: Joi.string().allow("", null),
    status_code: Joi.string().allow("", null),
    category_code: Joi.string().allow("", null),
    start_date: Joi.string().allow("", null),
    end_date: Joi.string().allow("", null),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.getDashboard = (req) => {
  let schema = Joi.object({
    start_date: Joi.string().allow("", null),
    end_date: Joi.string().allow("", null),
    periode: Joi.string().allow("", null),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.getDetailFinanceValidation = (req) => {
  let schema = Joi.object({
    finance_id: Joi.number().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
