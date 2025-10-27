const _ = require("../../config/DB");
class FinanceRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("finance").where(params).first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getRepository(params) {
    try {
      const result = await _.select(
        "f.id",
        "plv1.value as type",
        "plv2.value as category",
        "plv3.value as status",
        "plv1.badge as type_badge",
        "plv2.badge as category_badge",
        "plv3.badge as status_badge",
        "f.finance_code",
        "f.category_code",
        "f.status_code",
        "f.source_id",
        "f.source_table",
        "f.path",
        "f.description",
        "f.total",
        "f.reference",
        "f.input_date",
        "f.created_at",
        _.raw("count(*) over() as exx")
      )
        .from("finance as f")
        .join(
          "parameter_lookup_values as plv1",
          "f.finance_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "f.category_code",
          "plv2.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv3",
          "f.status_code",
          "plv3.lookup_value_code"
        )
        .where((qb) => {
          if (params.search) {
            qb.where("f.description", "ilike", `%${params.search}%`);
          }
          if (params.finance_code) {
            qb.andWhere("f.finance_code", params.finance_code);
          }
          if (params.status_code) {
            qb.andWhere("f.status_code", params.status_code);
          }
          if (params.category_code) {
            qb.andWhere("f.category_code", params.category_code);
          }

          if (params.start_date) {
            qb.andWhere("f.input_date", ">=", params.start_date);
          } else if (params.end_date) {
            qb.andWhere("f.input_date", "<=", params.end_date);
          }
        })
        .whereNull("f.deleted_at")
        .offset(params.page)
        .limit(params.size);
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneEmailPhoneRepository(params) {
    try {
      const result = await _.from("finance")
        .where("email", params.email)
        .orWhere("phone", params.phone)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCodeRepository(params) {
    try {
      let head = params.finance_code === "EXPENSE" ? "EX" : "IN";

      const result = await _.raw(`
          SELECT 
            CONCAT(
              '${head}-',
              TO_CHAR(NOW(), 'YY'),
              TO_CHAR(NOW(), 'DD'),
              LPAD((COUNT(*) + 1)::text, 6, '0')
            ) AS new_code
          FROM finance
          WHERE input_date = CURRENT_DATE
            AND deleted_at IS NULL;`);

      if (result)
        return this.success(result.rows[0], "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _.into("finance").insert(params);
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("finance").update(params).where(condition);
      if (result) return this.success(null, "Data updated successfully");
      return this.fail(null, "Data updated failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async deleteRepository(params) {
    try {
      const result = await _.from("finance").where(params).del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getAllRepository(params) {
    try {
      const result = await _.select().from("finance").whereNull("deleted_at");

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

module.exports = new FinanceRepository();
