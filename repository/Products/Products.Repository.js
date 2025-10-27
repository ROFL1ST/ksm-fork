const _ = require("../../config/DB");
class ProductsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("products")
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
        .from("products")
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
        .from("products")
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
        .from("products")
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
      const [result] = await _("products").insert(params).returning("*");
      if (result) return this.success(result, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("products").where(params).del();
      if (result) return this.success(null, "Data deleted successfully");
      return this.fail(null, "Data deleted failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async incrementOrderIndex(note_id, fromIndex, toIndex, step) {
    try {
      const result = await _("products")
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
      const result = await _.select().from("products").whereNull("deleted_at");

      if (result.length > 0) {
        return this.success(result, "Data found successfully");
      }
      return this.fail(null, "Data not found");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getProductViewRepository(params) {
    try {
      const response = await _("view_product_stock_distributions as vpsd")
        .select("vpsd.*", _.raw("count(*) over() as exx"))
        .where((qb) => {
          if (params.search) {
            qb.where("name", "ilike", `%${params.search}%`).orWhere(
              "code",
              "ilike",
              `%${params.search}%`
            );
          }
        })
        .limit(params.size)
        .offset(params.offset);

      return {
        status: true,
        response: response,
        messages: "Successfully Get Product Stock",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("products").update(params).where(condition);
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

module.exports = new ProductsRepository();
