const _ = require("../../config/DB");
class ProductDetailsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("product_details").where(params).first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneXUnitRepository(params) {
    try {
      const result = await _.from("product_details as pd")
        .join("product_units as pu", "pu.product_detail_id", "pd.id")
        .where("pu.unit_code", params.unit_code)
        .where("pd.description", params.description)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getDetailRepository(params) {
    try {
      const result = await _.select(
        "pd.product_id",
        "pd.id as product_detail_id"
      )
        .from("product_details as pd")
        .join("products as p", "p.id", "pd.product_id")
        .where("pd.description", params.description)
        .where("p.name", params.name)
        .whereNull("p.deleted_at")
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async GetProductDetailRepository(params) {
    try {
      const result = await _.select(
        "p.name",
        "pd.description",
        "pd.code",
        _.raw(`concat(p.name, " ",pd.description) as detail`)
      )
        .from("product_details as pd")
        .join("products as p", "p.id", "pd.product_id")
        .where("pd.id", params.product_detail_id)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getParentsByNoteIDRepository(params) {
    try {
      const result = await _.select()
        .from("product_details")
        .where("note_id", params.note_id)
        .whereNull("parent_id")
        .orderBy("order_index", "asc");
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getByConditionRepository(params) {
    try {
      const result = await _.select()
        .from("product_details")
        .where(params)
        .orderBy("description", "asc");
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      console.log(e, "err");
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
    FROM product_details
    WHERE created_at::date = CURRENT_DATE;`);
      if (result)
        return this.success(result.rows[0], "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const [result] = await _("product_details").insert(params).returning("*");
      if (result) return this.success(result, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("product_details").where(params).del();
      if (result) return this.success(null, "Data deleted successfully");
      return this.fail(null, "Data deleted failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async incrementOrderIndex(note_id, fromIndex, toIndex, step) {
    try {
      const result = await _("product_details")
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
  async incrementOrderUpdateIndex(note_id, fromIndex, toIndex, step) {
    try {
      const result = await _("product_details")
        .where("note_id", note_id)
        .andWhere("order_index", ">=", fromIndex)
        .andWhere("order_index", "<=", toIndex)
        .update({
          order_index: _("product_details.order_index").raw(
            `CASE 
            WHEN order_index BETWEEN ? AND ? 
            THEN order_index + ? 
            ELSE order_index 
          END`,
            [fromIndex, toIndex, step]
          ),
        });

      if (result) return this.success(null, "Data updated successfully");
      return this.fail(null, "No rows affected");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async updateRepository(params, condition) {
    try {
      const result = await _.from("product_details")
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

module.exports = new ProductDetailsRepository();
