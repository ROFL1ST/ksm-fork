const _ = require("../../config/DB");

class ResponsibilitiesRepository {
  async getOneRepository(params) {
    try {
      const response = await _.from("responsibilities").where(params).first();

      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllRepository() {
    try {
      const response = await _.from("responsibilities").whereNull("deleted_at");

      return this.success(response, "get data successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async DeleteRepository(params) {
    try {
      const response = await _.from("responsibilities").where(params).del();

      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async CreateRepository(params) {
    try {
      const response = await _.insert(params)
        .into("responsibilities")
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

module.exports = new ResponsibilitiesRepository();
