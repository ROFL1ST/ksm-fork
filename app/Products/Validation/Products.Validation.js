const Joi = require("joi");

exports.createProductValidation = (req) => {
  let schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    unit_code: Joi.string().required(),
    total_quantity: Joi.number().required(),
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
    name: Joi.string().required(),
    description: Joi.string().required(),
    unit_code: Joi.string().required(),
    quantity: Joi.number().required(),
    product_id: Joi.number().required(),
    product_detail_id: Joi.number().required(),
    product_unit_id: Joi.number().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.getProductsValidation = (req) => {
  let schema = Joi.object({
    search: Joi.string().allow("", null),
    size: Joi.number().required(),
    page: Joi.number().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.getCredentialProductValidation = (req) => {
  let schema = Joi.object({
    product_id: Joi.number().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.ProductDemandProductValidation = (req) => {
  const schema = Joi.object({
    request: Joi.array()
      .items(
        Joi.object({
          product_detail_id: Joi.number().required(),
          product_unit_id: Joi.number().required(),
          name: Joi.string().required(),
          exist: Joi.number().required(),
          quantity: Joi.number().required(),
          unit_code: Joi.string().required(),
        })
      )
      .required(),
    purchase_order_client_id: Joi.string().required(),
  });

  const validation = schema.validate(req, { abortEarly: false });

  if (validation.error) {
    return {
      status: false,
      validation: validation.error.details,
    };
  }

  return { status: true };
};

exports.getProductsDistributionValidation = (req) => {
  let schema = Joi.object({
    search: Joi.string().allow("", null),
    type: Joi.number().allow("", null),
    size: Joi.number().required(),
    page: Joi.number().required(),
    distribution_status: Joi.string().allow("", null),
    transaction_type: Joi.string().allow("", null),
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
exports.DistributionProductsValidation = (req) => {
  let schema = Joi.object({
    travel_code: Joi.string().required(),
    type: Joi.string().valid("IN", "OUT").required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.ProductsFollowUPValidation = (req) => {
  let schema = Joi.object({
    product_unit_id: Joi.number().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
