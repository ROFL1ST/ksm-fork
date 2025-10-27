const _ = require("../../config/DB");
class PurchaseOrderClientsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("purchase_order_clients")
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
        "poc.id",
        "c.name",
        "c.lat",
        "c.long",
        "c.phone",
        "c.address",
        "poc.client_id",
        "poc.status_trx_code",
        "poc.purchase_order_client_code",
        "poc.progress_type_code",
        "poc.send_date",
        "poc.payment_method_code",
        "poc.input_date",
        "poc.due_date",
        "poc.total",
        "plv1.value as type",
        "plv1.badge as type_badge",
        "plv2.value as payment_type",
        "plv3.value as status_trx",
        "plv3.badge as status_trx_badge",
        "a.name as created_by",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_clients as poc")
        .join("clients as c", "poc.client_id", "c.id")
        .join(
          "parameter_lookup_values as plv1",
          "poc.progress_type_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "poc.payment_method_code",
          "plv2.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv3",
          "poc.status_trx_code",
          "plv3.lookup_value_code"
        )
        .join("admins as a", "poc.created_by", "a.id")
        .where("poc.id", params.purchase_order_client_id)
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
    'POC-' ||
    to_char(now(), 'YY') ||
    to_char(now(), 'DD') ||
    LPAD((COUNT(*) + 1)::text, 6, '0') AS new_code
FROM purchase_order_clients
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
      const result = await _.into("purchase_order_clients").insert(params);
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("purchase_order_clients")
        .update(params)
        .where(condition);
      if (result) return this.success(null, "Data updated successfully");
      return this.fail(null, "Data updated failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("purchase_order_clients").where(params).del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllByCreatedByRepository(params) {
    try {
      const result = await _.select(
        "poc.id",
        "c.name",
        "poc.purchase_order_client_code",
        "poc.input_date",
        "poc.send_date",
        "poc.final_total",
        "poc.total",
        "poc.progress_type_code",
        "plv1.value as type",
        "plv1.badge as type_badge",
        "plv2.value as payment_type",
        "plv3.value as status_trx",
        "plv3.badge as status_trx_badge",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_clients as poc")
        .join("clients as c", "poc.client_id", "c.id")
        .join(
          "parameter_lookup_values as plv1",
          "poc.progress_type_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "poc.payment_method_code",
          "plv2.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv3",
          "poc.status_trx_code",
          "plv3.lookup_value_code"
        )
        .where((qb) => {
          if (params.search) {
            qb.where(function () {
              this.where(
                "poc.purchase_order_client_code",
                "ilike",
                `%${params.search}%`
              ).orWhere("c.name", "ilike", `%${params.search}%`);
            });
          }
          if (params.progress_type_code) {
            qb.andWhere("poc.progress_type_code", params.progress_type_code);
          }
          if (params.payment_method_code) {
            qb.andWhere("poc.payment_method_code", params.payment_method_code);
          }
          if (params.status_trx_code) {
            qb.andWhere("poc.status_trx_code", params.status_trx_code);
          }
          if (params.start_date && params.end_date) {
            qb.andWhereBetween("poc.input_date", [
              params.start_date,
              params.end_date,
            ]);
          } else if (params.start_date) {
            qb.andWhere("poc.input_date", ">=", params.start_date);
          } else if (params.end_date) {
            qb.andWhere("poc.input_date", "<=", params.end_date);
          }
        })
        .where("poc.created_by", params.id)
        .limit(params.size)
        .offset(params.page)
        .whereNull("poc.deleted_at")
        .orderBy("poc.created_at", "desc");

      return this.success(result, "Data found successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getAllRepository(params) {
    try {
      const result = await _.select(
        "poc.id",
        "c.name",
        "poc.purchase_order_client_code",
        "poc.input_date",
        "poc.send_date",
        "poc.final_total",
        "poc.total",
        "poc.progress_type_code",
        "plv1.value as type",
        "plv1.badge as type_badge",
        "plv2.value as payment_type",
        "plv3.value as status_trx",
        "plv3.badge as status_trx_badge",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_clients as poc")
        .join("clients as c", "poc.client_id", "c.id")
        .join(
          "parameter_lookup_values as plv1",
          "poc.progress_type_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "poc.payment_method_code",
          "plv2.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv3",
          "poc.status_trx_code",
          "plv3.lookup_value_code"
        )
        .where((qb) => {
          if (params.search) {
            qb.where(function () {
              this.where(
                "poc.purchase_order_client_code",
                "ilike",
                `%${params.search}%`
              ).orWhere("c.name", "ilike", `%${params.search}%`);
            });
          }
          if (params.progress_type_code) {
            qb.andWhere("poc.progress_type_code", params.progress_type_code);
          }
          if (params.payment_method_code) {
            qb.andWhere("poc.payment_method_code", params.payment_method_code);
          }
          if (params.status_trx_code) {
            qb.andWhere("poc.status_trx_code", params.status_trx_code);
          }
          if (params.start_date && params.end_date) {
            qb.andWhereBetween("poc.input_date", [
              params.start_date,
              params.end_date,
            ]);
          } else if (params.start_date) {
            qb.andWhere("poc.input_date", ">=", params.start_date);
          } else if (params.end_date) {
            qb.andWhere("poc.input_date", "<=", params.end_date);
          }
        })
        .limit(params.size)
        .offset(params.page)
        .whereNull("poc.deleted_at")
        .orderBy("poc.created_at", "desc");

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

module.exports = new PurchaseOrderClientsRepository();
