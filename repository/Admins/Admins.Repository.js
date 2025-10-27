const _ = require("../../config/DB");

class AdminsRepository {
  async getOneRepository(params) {
    try {
      const response = await _.from("admins").where(params).first();

      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "Account is Not Found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async UpdateRepository(params) {
    try {
      const response = await _.from("admins")
        .where("id", params.id)
        .update(params);
      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAdminsRepository(params) {
    try {
      const result = await _.select(
        "a.id",
        "a.name",
        "a.email",
        "a.path",
        _.raw("STRING_AGG(r.name, ', ') as responsibilities"),
        _.raw("COUNT(*) OVER() as exx")
      )
        .from("admins as a")
        .join("admin_responsibilities as ar", "ar.admin_id", "a.id")
        .join("responsibilities as r", "r.code", "ar.responsibility_code")
        .whereNull("a.deleted_at")
        .modify((qb) => {
          if (params.search) {
            qb.where("a.name", "ilike", `%${params.search}%`).orWhere(
              "a.email",
              "ilike",
              `%${params.search}%`
            );
          }
          if (params.responsibility_code) {
            qb.where("ar.responsibility_code", params.responsibility_code);
          }
        })
        .whereNull("a.deleted_at")
        .groupBy("a.id", "a.name", "a.email", "a.path")
        .limit(params.size)
        .offset(params.page);

      return this.success(result, "Data found successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getAdminsBoosterRepository(params) {
    try {
      const result = await _.select("a.id", "a.name", "a.email", "a.phone")
        .from("admins as a")
        .join("admin_responsibilities as ar", "ar.admin_id", "a.id")
        .join("responsibilities as r", "r.code", "ar.responsibility_code")
        .whereNull("a.deleted_at")
        .modify((qb) => {
          if (params.search) {
            qb.where("a.name", "ilike", `%${params.search}%`).orWhere(
              "a.email",
              "ilike",
              `%${params.search}%`
            );
          }
          if (params.responsibility_code) {
            qb.where("ar.responsibility_code", params.responsibility_code);
          }
        })
        .whereNull("a.deleted_at")
        .groupBy("a.id", "a.name", "a.email", "a.phone");

      return this.success(result, "Data found successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }

  async CreateRepository(params) {
    try {
      const response = await _.insert(params).into("admins").returning("*");

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

module.exports = new AdminsRepository();
