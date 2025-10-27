const _ = require("../../config/DB");

class ParameterRepository {
  async getParameterRepository(params) {
    try {
      const result = await _.select(
        "lpv.value",
        "lpv.lookup_value_id",
        "lpv.lookup_value_code",
        "lp.lookup_code",
        "lp.description as type",
        "lpv.description",
        _.raw("count(*) over() as total")
      )
        .from("parameter_lookups as lp")
        .join(
          "parameter_lookup_values as lpv",
          "lpv.param_lookup_id",
          "lp.param_lookup_id"
        )
        .where((qb) => {
          if (params.lookup_code)
            qb.where("lp.lookup_code", params.lookup_code);
          if (params.search) {
            qb.where("lp.description", "ilike", `%${params.search}%`).orWhere(
              "lpv.description",
              "ilike",
              `%${params.search}%`
            );
          }
        })
        .limit(params.size)
        .offset(params.page);

      return this.success(result, "Data found successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getOneParameterValueRepository(params) {
    try {
      const result = await _.select(
        "lpv.value",
        "lpv.lookup_value_id",
        "lpv.lookup_value_code",
        "lp.lookup_code",
        "lp.description as type",
        "lpv.description"
      )
        .from("parameter_lookups as lp")
        .join(
          "parameter_lookup_values as lpv",
          "lpv.param_lookup_id",
          "lp.param_lookup_id"
        )
        .where("lpv.lookup_value_code", params.lookup_value_code)
        .where("lp.lookup_code", params.lookup_code)
        .first();

      return this.success(result, "Data found successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getParamLookupsRepository() {
    try {
      const response = await _.select("lookup_code", "description").from(
        "parameter_lookups"
      );
      return this.success(response, "get data successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getParamLookupValuesRepository(params) {
    try {
      const response = await _.select("plv.lookup_value_code", "plv.value")
        .from("parameter_lookups as pl")
        .join(
          "parameter_lookup_values as plv",
          "plv.param_lookup_id",
          "pl.param_lookup_id"
        )
        .where("pl.lookup_code", params.lookup_code);

      return this.success(response, "get data successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getGroupParamLookupValuesRepository(params) {
    try {
      const response = await _.select("plv.lookup_value_code", "plv.value")
        .from("parameter_lookups as pl")
        .join(
          "parameter_lookup_values as plv",
          "plv.param_lookup_id",
          "pl.param_lookup_id"
        )
        .whereIn("plv.lookup_value_code", params.lookup_value_code);

      return this.success(response, "get data successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getOneParamLookupsRepository(params) {
    try {
      const response = await _.from("parameter_lookups").where(params).first();
      return this.success(response, "get data successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getOneParamLookupValueRepository(params) {
    try {
      const response = await _.from("parameter_lookup_values")
        .where(params)
        .first();
      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async getOneParamLookupValueAdnNotRepository(params, condition) {
    try {
      console.log(params);
      const response = await _.from("parameter_lookup_values")
        .where(params)
        .whereNot(condition)
        .first();
      if (response) return this.success(response, "get data successfully");
      return this.fail(null, "get data unsuccessfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async createParameterValueRepository(params) {
    try {
      const response = await _.insert(params).into("parameter_lookup_values");

      if (response) return this.success(null, "User created successfully");

      return this.fail(null, "User creation failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async deleteParameterValueRepository(params) {
    try {
      const response = await _.where(params)
        .from("parameter_lookup_values")
        .del();

      if (response && response.length > 0)
        return this.success(null, "User created successfully");

      return this.fail(null, "User creation failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async updateParameterValueRepository(params, condition) {
    try {
      const result = await _.from("parameter_lookup_values")
        .update(params)
        .where(condition);
      if (result) return this.success(null, "Data updated successfully");
      return this.fail(null, "Data updated failed");
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

module.exports = new ParameterRepository();
