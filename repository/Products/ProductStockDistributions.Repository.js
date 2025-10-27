const _ = require("../../config/DB");
class ProductStockDistributionsRepository {
  async CheckStockByProductDetailID(params) {
    try {
      const response = await _("view_product_stock_distributions")
        .select("code", "name", _.raw("? as quantity", [params.quantity]))
        .where("product_detail_id", params.product_detail_id)
        .where("unit_code", params.unit_code)
        .where("total_quantity", ">=", params.quantity)
        .first();

      if (response)
        return {
          status: true,
          response: response,
          messages: "Successfully Get Product Stock",
        };
      return {
        status: false,
        response: null,
        messages: "This product is out of stock",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async getRestockProducts(params) {
    try {
      const response = await _("view_product_stock_distributions as vpsd")
        .select("vpsd.*", _.raw("count(*) over() as exx"))
        .where("vpsd.total_quantity", "<", 10)
        .limit(params.size)
        .offset(params.page);

      return {
        status: true,
        response: response,
        messages: "Successfully Get Product Stock",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async GetProductDistributions(params) {
    try {
      const response = await _("product_stock_distributions as psd")
        .select(
          "pd.code",
          _.raw("p.name || ' ' || pd.description AS name"),
          "psd.quantity",
          "psd.transactions_id",
          "psd.source_table",
          "pu.unit_code",
          "plv_status.value as status_distribution",
          "plv_trans.value as transaction_type",
          "plv_status.lookup_value_code as status_distribution_code",
          "plv_trans.lookup_value_code as transaction_type_code",
          "psd.created_at",
          "a.name as created_by",
          _.raw("count(*) over() as exx")
        )
        .join("product_details as pd", "pd.id", "psd.product_detail_id")
        .join("products as p", "p.id", "psd.product_id")
        .join("product_units as pu", "pu.id", "psd.product_unit_id")
        .leftJoin(
          "parameter_lookup_values as plv_status",
          "plv_status.lookup_value_code",
          "psd.status_distribution_code"
        )
        .leftJoin(
          "parameter_lookup_values as plv_trans",
          "plv_trans.lookup_value_code",
          "psd.transaction_code"
        )
        .join("admins as a", "a.id", "psd.created_by")
        .where((qb) => {
          const type = Number(params.type);

          if (type === 1) {
            qb.where("psd.quantity", ">=", 0);
          } else if (type === 2) {
            qb.where("psd.quantity", "<", 0);
          }

          if (params.search) {
            qb.andWhere(function () {
              this.where("p.name", "ilike", `%${params.search}%`).orWhere(
                "pd.description",
                "ilike",
                `%${params.search}%`
              );
            });
          }

          if (params.distribution_status) {
            qb.andWhere(
              "psd.status_distribution_code",
              params.distribution_status
            );
          }

          if (params.transaction_type) {
            qb.andWhere("psd.transaction_code", params.transaction_type);
          }

          if (params.start_date) {
            qb.andWhere("psd.created_at", ">=", params.start_date);
          }

          if (params.end_date) {
            qb.andWhere("psd.created_at", "<=", params.end_date);
          }
        })

        .orderBy("psd.created_at", "desc")
        .offset(params.page)
        .limit(params.size);
      console.log(response);
      return {
        status: true,
        response: response,
        messages: "Successfully Get Product Stock",
      };
    } catch (e) {
      console.log(e);
      return { status: false, response: e, messages: e.message };
    }
  }

  async InsertProductDistributionRepository(params) {
    try {
      const response = await _.insert(params).into(
        "product_stock_distributions"
      );
      if (response)
        return {
          status: true,
          response: null,
          messages: "Successfully created",
        };
      return {
        status: false,
        response: null,
        messages: "Failed created",
      };
    } catch (e) {
      console.log(e);
      return { status: false, response: e, messages: e.message };
    }
  }
  async UpdateProductDistributionRepository(params, condition) {
    try {
      await _.update(params)
        .from("product_stock_distributions")
        .where(condition);
      return { status: true, response: null, messages: "Successfully created" };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async DeleteProductDistributionRepository(params) {
    try {
      const response = await _.from("product_stock_distributions")
        .where(params)
        .del();
      if (response)
        return {
          status: true,
          response: null,
          messages: "Successfully Deleted",
        };
      return { status: true, response: null, messages: "Failed Deleted" };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async GetOneProductDistributionRepository(params) {
    try {
      const response = await _.select()
        .from("view_product_stock_distributions")
        .where(params)
        .first();
      if (response)
        return {
          status: true,
          response: response,
          messages: "Successfully Get Product Stock",
        };
      return {
        status: false,
        response: null,
        messages: "This product is out of stock",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async getDistributionByTrxIDRepository(params) {
    try {
      const result = await _.select(
        "popv.quantity",
        "psd.quantity as received_quantity",
        "psd.quantity as received_quantity_fix",
        "p.name",
        "pd.description",
        "pd.code",
        "psd.product_id",
        "psd.product_detail_id",
        "psd.product_unit_id"
      )
        .from("product_stock_distributions as psd")
        .join(
          "purchase_order_vendor_delivery as povd",
          "psd.transactions_id",
          "povd.id"
        )
        .join(
          "purchase_order_product_vendors as popv",
          "popv.purchase_order_vendor_id",
          "povd.purchase_order_vendor_id"
        )
        .join("products as p", "p.id", "popv.product_id")
        .join("product_details as pd", "pd.id", "popv.product_detail_id")
        .where("povd.id", params.transactions_id)
        .where("psd.transaction_code", "ADD_STOCK")
        .whereRaw("psd.product_unit_id = popv.product_unit_id");

      return {
        status: true,
        response: result,
        messages: "Data found successfully",
      };
    } catch (e) {
      console.log(e);
      return { status: false, response: e, messages: e.message };
    }
  }
  async getDetailProductsReceivedRepository(params) {
    try {
      const result = await _("purchase_order_product_vendors as popv")
        .join("products as p", "p.id", "popv.product_id")
        .join("product_details as pd", "pd.id", "popv.product_detail_id")
        .join("product_units as pu", "pu.id", "popv.product_unit_id")
        .leftJoin("purchase_order_vendor_delivery as povd", function () {
          this.on(
            "povd.purchase_order_vendor_id",
            "=",
            "popv.purchase_order_vendor_id"
          ).andOnNull("povd.deleted_at");
        })
        .leftJoin("product_stock_distributions as psd", function () {
          this.on("psd.transactions_id", "=", "povd.id")
            .andOn("psd.product_id", "=", "popv.product_id")
            .andOn("psd.product_detail_id", "=", "popv.product_detail_id")
            .andOn("psd.product_unit_id", "=", "pu.id")
            .andOn("psd.transaction_code", "=", _.raw("?", ["ADD_STOCK"]))
            .andOnNull("psd.deleted_at");
        })
        .select(
          _.raw("COALESCE(SUM(psd.quantity), 0) AS received_quantity"),
          _.raw("COALESCE(SUM(psd.quantity), 0) AS received_quantity_fix"),
          "popv.quantity",
          "p.name",
          "pd.description",
          "pd.code",
          "popv.product_id",
          "popv.product_detail_id",
          "pu.id AS product_unit_id",
          "pu.unit_code"
        )
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .whereNull("popv.deleted_at")
        .groupBy(
          "popv.quantity",
          "p.name",
          "pd.description",
          "pd.code",
          "popv.product_id",
          "popv.product_detail_id",
          "pu.id",
          "pu.unit_code",
          "popv.created_at"
        )
        .orderBy("popv.created_at", "desc");

      return {
        status: true,
        response: result,
        messages: "Data found successfully",
      };
    } catch (e) {
      console.log(e);
      return { status: false, response: e, messages: e.message };
    }
  }
  async getDetailProductsReceivedByDeliveryIDRepository(params) {
    try {
      const result = await _("purchase_order_product_vendors as popv")
        .join("products as p", "p.id", "popv.product_id")
        .join("product_details as pd", "pd.id", "popv.product_detail_id")
        .join("product_units as pu", "pu.unit_code", "popv.unit_code")
        .leftJoin("purchase_order_vendor_delivery as povd", function () {
          this.on(
            "povd.purchase_order_vendor_id",
            "=",
            "popv.purchase_order_vendor_id"
          ).andOnNull("povd.deleted_at");
        })
        .leftJoin("product_stock_distributions as psd", function () {
          this.on("psd.transactions_id", "=", "povd.id")
            .andOn("psd.product_id", "=", "popv.product_id")
            .andOn("psd.product_detail_id", "=", "popv.product_detail_id")
            .andOn("psd.product_unit_id", "=", "pu.id")
            .andOn("psd.transaction_code", "=", _.raw("?", ["ADD_STOCK"]))
            .andOnNull("psd.deleted_at");
        })
        .select(
          _.raw("COALESCE(SUM(psd.quantity), 0) AS received_quantity"),
          _.raw("COALESCE(SUM(psd.quantity), 0) AS received_quantity_fix"),
          "popv.quantity",
          "p.name",
          "pd.description",
          "pd.code",
          "popv.product_id",
          "popv.product_detail_id",
          "pu.id AS product_unit_id",
          "pu.unit_code"
        )
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .where("povd.id", params.purchase_order_vendor_delivery_id)
        .whereNull("popv.deleted_at")
        .groupBy(
          "popv.quantity",
          "p.name",
          "pd.description",
          "pd.code",
          "popv.product_id",
          "popv.product_detail_id",
          "pu.id",
          "pu.unit_code",
          "popv.created_at"
        )
        .orderBy("popv.created_at", "desc");

      return {
        status: true,
        response: result,
        messages: "Data found successfully",
      };
    } catch (e) {
      console.log(e);
      return { status: false, response: e, messages: e.message };
    }
  }
}

module.exports = new ProductStockDistributionsRepository();
