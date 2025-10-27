const _ = require("../../config/DB");
class ProductFollowUpRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("products_follow_up")
        .where(params)
        .whereNull("deleted_at")
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getByNoteIDRepository(params) {
    try {
      const result = await _.select()
        .from("products_follow_up")
        .where("note_id", params.note_id)
        .orderBy("order_index", "asc");
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getParentsByNoteIDRepository(params) {
    try {
      const result = await _.select()
        .from("products_follow_up")
        .where("note_id", params.note_id)
        .whereNull("parent_id")
        .orderBy("order_index", "asc");
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getByConditionFirstRepository(params) {
    try {
      const result = await _.select()
        .from("products_follow_up")
        .where(params)
        .orderBy("order_index", "desc")
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _("products_follow_up").insert(params);
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("products_follow_up").where(params).del();
      if (result) return this.success(null, "Data deleted successfully");
      return this.fail(null, "Data deleted failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async incrementOrderIndex(note_id, fromIndex, toIndex, step) {
    try {
      const result = await _("products_follow_up")
        .where("note_id", note_id)
        .andWhere("order_index", ">=", fromIndex)
        .andWhere("order_index", "<=", toIndex)
        .increment("order_index", step);
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllRepository() {
    try {
      const result = await _.select()
        .from("products_follow_up")
        .whereNull("deleted_at");

      if (result.length > 0) {
        return this.success(result, "Data found successfully");
      }
      return this.fail(null, "Data not found");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getByUnitIDRepository(params) {
    try {
      const result = await _.select(
        "pfu.*",
        "a.name as created_by",
        "poc.purchase_order_client_code"
      )
        .from("products_follow_up as pfu")
        .where("pfu.product_unit_id", params.product_unit_id)
        .join(
          "purchase_order_clients as poc",
          "poc.id",
          "pfu.purchase_order_client_id"
        )
        .join("admins as a", "a.id", "pfu.created_by")
        .whereNull("poc.deleted_at")
        .orderBy("poc.created_at", "desc");

      if (result.length > 0) {
        return this.success(result, "Data found successfully");
      }
      return this.fail(null, "Data not found");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getAllGroupRepository() {
    try {
      const result = await _.select("vpfu.*", "vpsd.total_quantity")
        .from("view_products_follow_up as vpfu")
        .join(
          "view_product_stock_distributions as vpsd",
          "vpsd.product_unit_id",
          "vpfu.product_unit_id"
        );

      if (result.length > 0) {
        return this.success(result, "Data found successfully");
      }
      return this.fail(null, "Data not found");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getOneViewRepository(params) {
    try {
      const result = await _.select("vpfu.*", "vpsd.total_quantity")
        .from("view_products_follow_up as vpfu")
        .join(
          "view_product_stock_distributions as vpsd",
          "vpsd.product_unit_id",
          "vpfu.product_unit_id"
        )
        .where("vpfu.product_detail_id", params.product_detail_id)
        .where("vpsd.unit_code", params.unit_code)
        .first();

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }

  async updateRepository(params, condition) {
    try {
      const result = await _.from("products_follow_up")
        .update(params)
        .where(condition);
      if (result) return this.success(null, "Data updated successfully");
      return this.fail(null, "Data updated failed");
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

module.exports = new ProductFollowUpRepository();
