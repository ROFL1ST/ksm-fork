const _ = require("../../config/DB");
class PurchaseOrderTravelDocumentClientsRepositoryRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("purchase_order_travel_document_clients")
        .where(params)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _.into("purchase_order_travel_document_clients")
        .insert(params)
        .returning("*");
      if (result) return this.success(result[0], "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("purchase_order_travel_document_clients")
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
      const result = await _.from("purchase_order_travel_document_clients")
        .where(params)
        .del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCodeRepository() {
    try {
      const result = await _.raw(`SELECT 
        'SJ-' ||
        to_char(now(), 'YY') ||
        to_char(now(), 'DD') ||
        LPAD((COUNT(*) + 1)::text, 6, '0') AS new_code
      FROM purchase_order_travel_document_clients
      WHERE created_at::date = CURRENT_DATE`);
      if (result)
        return this.success(result.rows[0], "Data found successfully");
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

module.exports = new PurchaseOrderTravelDocumentClientsRepositoryRepository();
