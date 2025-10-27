const _ = require("../../config/DB");
class ProductUnitsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("product_units")
        .where(params)
        .whereNull("deleted_at")
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneAndNotRepository(params) {
    try {
      const result = await _.from("product_units")
        .where(params)
        .whereNot(params)
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
        .from("product_units")
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
        .from("product_units")
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
        .from("product_units")
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
      const [result] = await _("product_units").insert(params).returning("*");
      if (result) return this.success(result, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCodePORepository() {
    try {
      const result = await _.raw(`SELECT 
        'PRD-' ||
        to_char(now(), 'YY') ||
        to_char(now(), 'DD') ||
        LPAD((COUNT(*) + 1)::text, 6, '0') AS new_code
      FROM product_units
      WHERE created_at::date = CURRENT_DATE;`);
      if (result)
        return this.success(result.rows[0], "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("product_units").where(params).del();
      if (result) return this.success(null, "Data deleted successfully");
      return this.fail(null, "Data deleted failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async incrementOrderIndex(note_id, fromIndex, toIndex, step) {
    try {
      const result = await _("product_units")
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
        .from("product_units")
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

  async updateRepository(params, condition) {
    try {
      const result = await _.from("product_units")
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

module.exports = new ProductUnitsRepository();
