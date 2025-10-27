const _ = require("../../config/DB");
class PurchaseOrderProductClientsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("purchase_order_product_clients")
        .where(params)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneDetailRepository(params) {
    try {
      const result = await _("purchase_order_product_clients as popc")
        .join("products as p", "p.id", "popc.product_id")
        .join("product_details as pd", "pd.id", "popc.product_detail_id")
        .select("popc.*", "p.name as product_name", "pd.description", "pd.code")
        .where("popc.purchase_order_client_id", params.purchase_order_client_id)
        .whereNull("popc.deleted_at")
        .orderBy("popc.created_at", "desc");

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCountQuantityDetailRepository(params) {
    try {
      const result = await _("purchase_order_product_clients as popc")
        .select(
          _.raw("COUNT(*) AS items"),
          _.raw("SUM(popc.quantity) AS quantity")
        )
        .where("popc.purchase_order_client_id", params.purchase_order_client_id)
        .whereNull("popc.deleted_at")
        .first();

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _.into("purchase_order_product_clients").insert(
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
      const result = await _.from("purchase_order_product_clients")
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
      const result = await _.from("purchase_order_product_clients")
        .where(params)
        .del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getByUserIDRepository(params) {
    try {
      const result = await _.select("*", _.raw("count(*) over() as total"))
        .from("purchase_order_product_clients")
        .where("user_id", params.id)
        .where((qb) => {
          if (params.search) {
            qb.orWhere("title", "ilike", `%${params.search}%`);
          }
        })
        .limit(params.size)
        .offset(params.page);

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
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

module.exports = new PurchaseOrderProductClientsRepository();
