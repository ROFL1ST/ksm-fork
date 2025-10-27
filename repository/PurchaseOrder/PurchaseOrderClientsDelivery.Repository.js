const _ = require("../../config/DB");
class PurchaseOrderClientsDeliveryRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("purchase_order_clients_delivery")
        .where(params)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneDetailDeliveryRepository(params) {
    try {
      const result = await _.select(
        "pocd.travel_code",
        "potdc.distribution_status",
        "a.name as driver_name",
        "a.phone"
      )
        .from("purchase_order_clients_delivery as pocd")
        .join(
          "purchase_order_travel_document_clients as potdc",
          "potdc.purchase_order_client_id",
          "pocd.purchase_order_client_id"
        )
        .join("admins as a", "a.id", "pocd.driver_id")
        .where((qb) => {
          if (params.purchase_order_client_id) {
            qb.where(
              "potdc.purchase_order_client_id",
              params.purchase_order_client_id
            );
          }
          if (params.travel_code) {
            qb.where("potdc.travel_code", params.travel_code);
          }
        })
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneDetailRepository(params) {
    try {
      const result = await _("purchase_order_clients_delivery as popv")
        .join("products as p", "p.id", "popv.product_id")
        .join("product_details as pd", "pd.id", "popv.product_detail_id")
        .select("popv.*", "p.name as product_name", "pd.description", "pd.code")
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .whereNull("popv.deleted_at")
        .orderBy("popv.created_at", "desc");

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCountQuantityDetailRepository(params) {
    try {
      const result = await _("purchase_order_clients_delivery as popv")
        .select(
          _.raw("COUNT(*) AS items"),
          _.raw("SUM(popv.quantity) AS quantity")
        )
        .where("popv.purchase_order_client_id", params.purchase_order_client_id)
        .whereNull("popv.deleted_at")
        .first();

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _.into("purchase_order_clients_delivery").insert(
        params
      );
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("purchase_order_clients_delivery")
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
      const result = await _.from("purchase_order_clients_delivery")
        .where(params)
        .del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getByDriverIDRepository(params) {
    try {
      const result = await _.select(
        "pocd.travel_code",
        "pocd.purchase_order_client_id",
        "plv1.value as progress_type",
        "plv2.value as payment_method",
        "poc.purchase_order_client_code",
        "c.name",
        "a.name as driver_name",
        "c.phone",
        "c.lat",
        "c.long",
        "poc.send_date as request_send_date",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_clients_delivery as pocd")
        .join(
          "purchase_order_clients as poc",
          "poc.id",
          "pocd.purchase_order_client_id"
        )
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
        .join("admins as a", "a.id", "pocd.driver_id")
        .join("clients as c", "poc.client_id", "c.id")
        .where("pocd.driver_id", params.id)
        .where((qb) => {
          if (params.search) {
            qb.orWhere("c.name", "ilike", `%${params.search}%`)
              .orWhere("pocd.travel_code", "like", `%${params.search}%`)
              .orWhere(
                "poc.purchase_order_client_code",
                "like",
                `%${params.search}%`
              );
          }
        })
        .limit(params.size)
        .offset(params.page);

      return this.success(result, "Data found successfully");
    } catch (e) {
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

module.exports = new PurchaseOrderClientsDeliveryRepository();
