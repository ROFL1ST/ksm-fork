const _ = require("../../config/DB");
class PurchaseOrderVendorsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("purchase_order_vendors")
        .where(params)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getDetailOneRepository(params) {
    try {
      const result = await _.select(
        "pov.id",
        "v.name",
        "pov.vendor_id",
        "pov.status_trx_code",
        "pov.purchase_order_vendor_code",
        "pov.progress_type_code",
        "pov.send_date",
        "pov.payment_method_code",
        "pov.input_date",
        "pov.due_date",
        "pov.total",
        "plv1.value as type",
        "plv1.badge as type_badge",
        "plv2.value as payment_type",
        "plv3.value as status_trx",
        "plv3.badge as status_trx_badge",
        "a.name as created_by",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_vendors as pov")
        .join("vendors as v", "v.id", "pov.vendor_id")
        .join(
          "parameter_lookup_values as plv1",
          "pov.progress_type_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "pov.payment_method_code",
          "plv2.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv3",
          "pov.status_trx_code",
          "plv3.lookup_value_code"
        )
        .join("admins as a", "pov.created_by", "a.id")
        .where("pov.id", params.purchase_order_vendor_id)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCodePORepository() {
    try {
      const result = await _.raw(`SELECT 
    'POV-' ||
    to_char(now(), 'YY') ||
    to_char(now(), 'DD') ||
    LPAD((COUNT(*) + 1)::text, 6, '0') AS new_code
FROM purchase_order_vendors
WHERE input_date = CURRENT_DATE`);
      if (result)
        return this.success(result.rows[0], "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _.into("purchase_order_vendors").insert(params);
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("purchase_order_vendors")
        .update(params)
        .where(condition);
      if (result) return this.success(null, "Data updated successfully");
      return this.fail(null, "Data updated failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("purchase_order_vendors").where(params).del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllByCreatedByRepository(params) {
    try {
      const result = await _.select(
        "pov.id",
        "v.name",
        "pov.purchase_order_vendor_code",
        "pov.input_date",
        "pov.send_date",
        "pov.final_total",
        "pov.total",
        "pov.progress_type_code",
        "plv1.value as type",
        "plv1.badge as type_badge",
        "plv2.value as payment_type",
        "plv3.value as status_trx",
        "plv3.badge as status_trx_badge",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_vendors as pov")
        .join("vendors as c", "pov.vendor_id", "c.id")
        .join(
          "parameter_lookup_values as plv1",
          "pov.progress_type_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "pov.payment_method_code",
          "plv2.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv3",
          "pov.status_trx_code",
          "plv3.lookup_value_code"
        )
        .where((qb) => {
          if (params.search) {
            qb.where(function () {
              this.where(
                "pov.purchase_order_vendor_code",
                "ilike",
                `%${params.search}%`
              ).orWhere("v.name", "ilike", `%${params.search}%`);
            });
          }
          if (params.progress_type_code) {
            qb.andWhere("pov.progress_type_code", params.progress_type_code);
          }
          if (params.payment_method_code) {
            qb.andWhere("pov.payment_method_code", params.payment_method_code);
          }
          if (params.status_trx_code) {
            qb.andWhere("pov.status_trx_code", params.status_trx_code);
          }
          if (params.start_date && params.end_date) {
            qb.andWhereBetween("pov.input_date", [
              params.start_date,
              params.end_date,
            ]);
          } else if (params.start_date) {
            qb.andWhere("pov.input_date", ">=", params.start_date);
          } else if (params.end_date) {
            qb.andWhere("pov.input_date", "<=", params.end_date);
          }
        })
        .where("pov.created_by", params.id)
        .limit(params.size)
        .offset(params.page)
        .whereNull("pov.deleted_at")
        .orderBy("pov.created_at", "desc");
      return this.success(result, "Data found successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getAllRepository(params) {
    try {
      const result = await _.select(
        "pov.id",
        "v.name",
        "pov.purchase_order_vendor_code",
        "pov.input_date",
        "pov.send_date",
        "pov.final_total",
        "pov.total",
        "pov.progress_type_code",
        "plv1.value as type",
        "plv1.badge as type_badge",
        "plv2.value as payment_type",
        "plv3.value as status_trx",
        "plv3.badge as status_trx_badge",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_vendors as pov")
        .join("vendors as v", "v.id", "pov.vendor_id")
        .join(
          "parameter_lookup_values as plv1",
          "pov.progress_type_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "pov.payment_method_code",
          "plv2.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv3",
          "pov.status_trx_code",
          "plv3.lookup_value_code"
        )
        .where((qb) => {
          if (params.type === 1) {
            qb.whereIn("pov.progress_type_code", [
              "IN_PROGRESS_ORDER",
              "WAREHOUSE_LOADING",
            ]);
          }
          if (params.search) {
            qb.where(function () {
              this.where(
                "pov.purchase_order_vendor_code",
                "ilike",
                `%${params.search}%`
              ).orWhere("v.name", "ilike", `%${params.search}%`);
            });
          }
          if (params.progress_type_code) {
            qb.andWhere("pov.progress_type_code", params.progress_type_code);
          }
          if (params.payment_method_code) {
            qb.andWhere("pov.payment_method_code", params.payment_method_code);
          }
          if (params.status_trx_code) {
            qb.andWhere("pov.status_trx_code", params.status_trx_code);
          }
          if (params.start_date && params.end_date) {
            qb.andWhereBetween("pov.input_date", [
              params.start_date,
              params.end_date,
            ]);
          } else if (params.start_date) {
            qb.andWhere("pov.input_date", ">=", params.start_date);
          } else if (params.end_date) {
            qb.andWhere("pov.input_date", "<=", params.end_date);
          }
        })
        .limit(params.size)
        .offset(params.page)
        .whereNull("pov.deleted_at")
        .orderBy("pov.created_at", "desc");

      return this.success(result, "Data found successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }

  success(data, message) {
    return { status: true, response: data, messages: message };
  }

  fail(data, message) {
    return { status: false, response: data, messages: message };
  }
}

module.exports = new PurchaseOrderVendorsRepository();
