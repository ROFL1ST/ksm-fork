const Joi = require("joi");

exports.CreateVendorValidation = (req) => {
  let schema = Joi.object({
    vendor_id: Joi.number().required(),
    total: Joi.number().required(),
    input_date: Joi.string().required(),
    due_date: Joi.string().required(),
    input_date: Joi.date().required(),
    send_date: Joi.date().required(),
    payment_method_code: Joi.string().required(),
    items: Joi.array()
      .items({
        product_id: Joi.number().allow("", null),
        product_detail_id: Joi.number().allow("", null),
        name: Joi.string().allow("", null),
        discount_percentage: Joi.string().allow("", null),
        discount_amount: Joi.number().allow(0, null),
        description: Joi.string().allow("", null),
        quantity: Joi.number().required(),
        is_ppn: Joi.boolean().required(),
        unit_code: Joi.string().required(),
        price: Joi.number().required(),
      })
      .required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
/**
 * Validate the request body for update purchase order client
 * @param {Object} req - request body
 * @return {Object} - validation result
 */
exports.UpdateVendorValidation = (req) => {
  let schema = Joi.object({
    purchase_order_vendor_id: Joi.string().required(),
    vendor_id: Joi.number().required(),
    total: Joi.number().required(),
    due_date: Joi.string().required(),
    input_date: Joi.date().required(),
    send_date: Joi.date().required(),
    payment_method_code: Joi.string().required(),
    status_trx_code: Joi.string().required(),
    progress_type_code: Joi.string().required(),
    items: Joi.array()
      .items({
        product_id: Joi.number().allow("", null),
        product_detail_id: Joi.number().allow("", null),
        name: Joi.string().allow("", null),
        description: Joi.string().allow("", null),
        quantity: Joi.number().required(),
        discount_percentage: Joi.string().allow("", null),
        discount_amount: Joi.number().allow(0, null),
        is_ppn: Joi.boolean().required(),
        unit_code: Joi.string().required(),
        price: Joi.number().required(),
      })
      .required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.CreateDocumentsValidation = (req) => {
  let schema = Joi.object({
    token: Joi.string().required(),
    key_id: Joi.number().required(),
    source: Joi.string().required(),
    value_code: Joi.string().required(),
    type_code: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};

exports.CreateDocumentsValidation = (req) => {
  let schema = Joi.object({
    token: Joi.string().required(),
    key_id: Joi.number().required(),
    source: Joi.string().required(),
    value_code: Joi.string().required(),
    type_code: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.GetAllDocumentsValidation = (req) => {
  let schema = Joi.object({
    size: Joi.number().required(),
    page: Joi.number().required(),
    type: Joi.number().allow("", null),
    search: Joi.string().allow("", null),
    progress_type_code: Joi.string().allow("", null),
    status_trx_code: Joi.string().allow("", null),
    payment_method_code: Joi.string().allow("", null),
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
exports.ByIdValidation = (req) => {
  let schema = Joi.object({
    access_key: Joi.object().required(),
    purchase_order_vendor_id: Joi.number().required(),
    search: Joi.string().allow("", null),
    size: Joi.number(),
    page: Joi.number(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.DetailPurchaseOrderValidation = (req) => {
  let schema = Joi.object({
    purchase_order_vendor_id: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.DetailPurchaseOrderDeliveryIDValidation = (req) => {
  let schema = Joi.object({
    purchase_order_vendor_delivery_id: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.CreatePurchaseOrderDeliveryDetailValidation = (req) => {
  let schema = Joi.object({
    purchase_order_vendor_id: Joi.string().required(),
    driver_info: Joi.object({
      driver_name: Joi.string().required(),
      driver_phone: Joi.string().required(),
      driver_photo: Joi.string().required(),
    }).required(),
    items: Joi.array().items({
      product_id: Joi.number().required(),
      product_detail_id: Joi.number().required(),
      product_unit_id: Joi.number().required(),
      quantity: Joi.number().required(),
    }),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.UpdatePurchaseOrderDeliveryDetailValidation = (req) => {
  let schema = Joi.object({
    purchase_order_vendor_delivery_id: Joi.string().required(),
    purchase_order_vendor_id: Joi.string().required(),
    driver_info: Joi.object({
      driver_name: Joi.string().required(),
      driver_phone: Joi.string().required(),
      driver_photo: Joi.string().required(),
    }).required(),
    items: Joi.array().items({
      product_id: Joi.number().required(),
      product_detail_id: Joi.number().required(),
      product_unit_id: Joi.number().required(),
      quantity: Joi.number().required(),
    }),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.DetailPurchaseOrderByCodeValidation = (req) => {
  let schema = Joi.object({
    purchase_order_vendor_code: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.ManagePurchaseOrderValidation = (req) => {
  let schema = Joi.object({
    purchase_order_id: Joi.string().required(),
    description: Joi.string().required(),
    type_code: Joi.string().required(),
    status_code: Joi.string().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.UpdateShoppingPurchaseOrderValidation = (req) => {
  let schema = Joi.object({
    history_shopping_vendor_id: Joi.number().required(),
    token: Joi.string().required(),
    purchase_order_vendor_id: Joi.number().required(),
    purchase_order_product_vendor_id: Joi.number().required(),
    quantity: Joi.number().required(),
    existing_file_urls: Joi.array().allow("", null),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
exports.DeleteShoppingPurchaseOrderValidation = (req) => {
  let schema = Joi.object({
    history_shopping_vendor_id: Joi.number().required(),
    access_key: Joi.object().required(),
  });
  const validation = schema.validate(req);

  if (validation.error)
    return {
      status: false,
      validation: validation.error.details,
    };
  return { status: true };
};
