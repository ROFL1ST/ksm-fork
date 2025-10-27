const _ = require("../../config/DB");

class AdminResponsibilitiesRepository {
  async getOneRepository(params) {
    try {
      const response = await _.from("admin_responsibilities")
        .where(params)
        .first();

      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllByAdminIDRepository(params) {
    try {
      const response = await _.select("r.code", "r.name")
        .from("admin_responsibilities as ar")
        .join("responsibilities as r", "r.code", "ar.responsibility_code")
        .where("ar.admin_id", params.admin_id)
        .orderBy("r.name", "asc");

      if (response.length)
        return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllByCodeReponsibilityRepository(params) {
    try {
      const response = await _.select(
        "a.phone",
        "r.name as responsibility",
        "a.name"
      )
        .from("admin_responsibilities as ar")
        .join("admins as a", "a.id", "ar.admin_id")
        .join("responsibilities as r", "r.code", "ar.responsibility_code")
        .where("r.code", params.code);

      if (response.length)
        return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async DeleteRepository(params) {
    try {
      const response = await _.from("admin_responsibilities")
        .where(params)
        .del();

      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async CreateRepository(params) {
    try {
      const response = await _.insert(params)
        .into("admin_responsibilities")
        .returning("*");

      if (response && response.length > 0)
        return this.success(response[0], "User created successfully");

      return this.fail(null, "User creation failed");
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

module.exports = new AdminResponsibilitiesRepository();
