const _ = require("../../config/DB");
class ClientsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("clients").where(params).first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getRepository() {
    try {
      const result = await _.from("clients").whereNull("deleted_at");
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneEmailPhoneRepository(params) {
    try {
      const result = await _.from("clients")
        .where("email", params.email)
        .orWhere("phone", params.phone)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async createRepository(params) {
    try {
      const result = await _.into("clients").insert(params);
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("clients").update(params).where(condition);
      if (result) return this.success(null, "Data updated successfully");
      return this.fail(null, "Data updated failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("clients").where(params).del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllRepository() {
    try {
      const result = await _.select().from("clients").whereNull("deleted_at");

      if (result.length > 0) {
        return this.success(result, "Data found successfully");
      }
      return this.fail(null, "Data not found");
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

module.exports = new ClientsRepository();
