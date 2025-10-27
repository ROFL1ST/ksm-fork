const _ = require("../../config/DB");
class PurchaseOrderProductVendorsRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("purchase_order_product_vendors")
        .where(params)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneDetailRepository(params) {
    try {
      const result = await _("purchase_order_product_vendors as popv")
        .join("products as p", "p.id", "popv.product_id")
        .join("product_details as pd", "pd.id", "popv.product_detail_id")
        .select("popv.*", "p.name as product_name", "pd.description", "pd.code")
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .whereNull("popv.deleted_at")
        .orderBy("popv.created_at", "desc");

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCountQuantityDetailRepository(params) {
    try {
      const result = await _("purchase_order_product_vendors as popv")
        .select(
          _.raw("COUNT(*) AS items"),
          _.raw("SUM(popv.quantity) AS quantity")
        )
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .whereNull("popv.deleted_at")
        .first();

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getSumPriceDetailRepository(params) {
    try {
      const result = await _("purchase_order_product_vendors as popv")
        .select(
          _.raw("SUM(popv.total) AS price"), // apakah bisa kasih format idr disini ?
          _.raw("SUM(popv.discount_amount) AS discount_amount"),
          _.raw("SUM(popv.ppn_amount) AS ppn_amount"),
          _.raw("SUM(popv.final_total) AS final_total")
        )
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .whereNull("popv.deleted_at")
        .first();

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getSumCurrencyPriceDetailRepository(params) {
    try {
      const result = await _("purchase_order_product_vendors as popv")
        .select(
          _.raw(
            "CONCAT('Rp', TO_CHAR(SUM(popv.total), 'FM999G999G999G999')) AS price"
          ),
          _.raw(
            "CONCAT('Rp', TO_CHAR(SUM(popv.discount_amount), 'FM999G999G999G999')) AS discount_amount"
          ),
          _.raw(
            "CONCAT('Rp', TO_CHAR(SUM(popv.ppn_amount), 'FM999G999G999G999')) AS ppn_amount"
          ),
          _.raw(
            "CONCAT('Rp', TO_CHAR(SUM(popv.final_total), 'FM999G999G999G999')) AS final_total"
          )
        )
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .whereNull("popv.deleted_at")
        .first();

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _.into("purchase_order_product_vendors").insert(
        params
      );
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const result = await _.from("purchase_order_product_vendors")
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
      const result = await _.from("purchase_order_product_vendors")
        .where(params)
        .del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getByUserIDRepository(params) {
    try {
      const result = await _.select("*", _.raw("count(*) over() as total"))
        .from("purchase_order_product_vendors")
        .where("user_id", params.id)
        .where((qb) => {
          if (params.search) {
            qb.orWhere("title", "ilike", `%${params.search}%`);
          }
        })
        .limit(params.size)
        .offset(params.page);

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async GetReceivedDistributionRepository(params) {
    try {
      const response = await _.select(
        _.raw(`COALESCE(SUM(psd.quantity), 0) AS received_quantity`),
        _.raw(`CONCAT(p.name, ' ', pd.description) AS name`),
        _.raw(`popv.unit_code`),
        _.raw(`popv.product_unit_id`)
      )
        .from("purchase_order_product_vendors as popv")
        .leftJoin(
          "product_stock_distributions as psd",
          "psd.transaction_id",
          "popv.purchase_order_vendor_id"
        )
        .join("products as p", "p.id", "popv.product_id")
        .join("product_details as pd", "pd.id", "popv.product_detail_id")
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .andWhere(function () {
          this.whereNull("popv.deleted_at");
          this.whereNull(
            "psd.status_distribution_code",
            params.status_distribution_code
          );
        })
        .groupBy(
          "popv.product_unit_id",
          "p.name",
          "pd.description",
          "popv.unit_code"
        );

      return {
        status: true,
        response,
        messages: "Successfully Get Product Stock",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async GetReceivedDistributionRepository(params) {
    try {
      const response = await _.select(
        _.raw(`CONCAT(p.name, ' ', pd.description) AS name`),
        _.raw(`popv.unit_code`),
        _.raw(`popv.product_unit_id`)
      )
        .from("purchase_order_product_vendors as popv")
        .leftJoin(
          "product_stock_distributions as psd",
          "psd.transaction_id",
          "popv.purchase_order_vendor_id"
        )
        .join("products as p", "p.id", "popv.product_id")
        .join("product_details as pd", "pd.id", "popv.product_detail_id")
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .andWhere(function () {
          this.whereNull("popv.deleted_at");
        })
        .groupBy(
          "popv.product_unit_id",
          "p.name",
          "pd.description",
          "popv.unit_code"
        );

      return {
        status: true,
        response,
        messages: "Successfully Get Product Stock",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  success(data, message) {
    return { status: true, response: data, messages: message };
  }

  fail(data, message) {
    return { status: false, response: data, messages: message };
  }
}

module.exports = new PurchaseOrderProductVendorsRepository();
