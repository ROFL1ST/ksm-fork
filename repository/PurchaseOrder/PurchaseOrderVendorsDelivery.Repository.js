const _ = require("../../config/DB");
class PurchaseOrderVendorsDeliveryRepository {
  async getOneRepository(params) {
    try {
      const result = await _.from("purchase_order_vendor_delivery")
        .where(params)
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneDetailDeliveryRepository(params) {
    try {
      const result = await _.select(
        "povd.driver_name",
        "a.name as ",
        "povd.created_at"
      )
        .from("purchase_order_vendor_delivery as povd")
        .join(
          "purchase_order_vendors as pov",
          "pov.id",
          "povd.purchase_order_vendor_id"
        )
        .join("admins as a", "a.id", "pocd.driver_id")
        .first();
      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneDetailRepository(params) {
    try {
      const result = await _("purchase_order_vendor_delivery as popv")
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
  async getAllByPOVendorIDRepository(params) {
    try {
      const result = await _("purchase_order_vendor_delivery as popv")
        .select()
        .where("popv.purchase_order_vendor_id", params.purchase_order_vendor_id)
        .whereNull("popv.deleted_at");

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneActionDeliveryVendorRepository(params) {
    try {
      const result = await _("purchase_order_vendor_delivery as povd")
        .select("a.name as created_by", "povd.driver_name")
        .join("admins as a", "a.id", "povd.created_by")
        .where("povd.id", params.purchase_order_vendor_delivery_id)
        .whereNull("povd.deleted_at")
        .first();

      if (result) return this.success(result, "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const result = await _.into("purchase_order_vendor_delivery")
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
      const result = await _.from("purchase_order_vendor_delivery")
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
      const result = await _.from("purchase_order_vendor_delivery")
        .where(params)
        .del();
      if (result) return this.success(null, "Data created successfully");
      return this.fail(null, "Data created failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getCodePORepository() {
    try {
      const result = await _.raw(`
        SELECT 
          'POVD-' ||
          to_char(now(), 'YY') ||
          to_char(now(), 'DD') ||
          LPAD((COUNT(*) + 1)::text, 6, '0') AS new_code
        FROM purchase_order_vendor_delivery
        WHERE created_at::date = current_date;`);
      if (result)
        return this.success(result.rows[0], "Data found successfully");
      return this.fail(null, "Data not found");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getByDriverIDRepository(params) {
    try {
      const result = await _.select(
        "pocd.travel_code",
        "pocd.purchase_order_client_id",
        "plv1.value as progress_type",
        "plv2.value as payment_method",
        "poc.purchase_order_client_code",
        "c.name",
        "c.phone",
        "c.lat",
        "c.long",
        "poc.send_date as request_send_date",
        _.raw("count(*) over() as exx")
      )
        .from("purchase_order_vendor_delivery as pocd")
        .join(
          "purchase_order_clients as poc",
          "poc.id",
          "pocd.purchase_order_client_id"
        )
        .join(
          "parameter_lookup_values as plv1",
          "poc.progress_type_code",
          "plv1.lookup_value_code"
        )
        .join(
          "parameter_lookup_values as plv2",
          "poc.payment_method_code",
          "plv2.lookup_value_code"
        )
        .join("clients as c", "poc.client_id", "c.id")
        .where("pocd.driver_id", params.id)
        .where((qb) => {
          if (params.search) {
            qb.orWhere("c.name", "ilike", `%${params.search}%`)
              .orWhere("pocd.travel_code", "like", `%${params.search}%`)
              .orWhere(
                "poc.purchase_order_client_code",
                "like",
                `%${params.search}%`
              );
          }
        })
        .limit(params.size)
        .offset(params.page);

      return this.success(result, "Data found successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async isMatchReceivedQuantityRepository(params) {
    try {
      const result = await _.raw(`
          SELECT 
            COALESCE(
              (
                SELECT 
                  SUM(psd.quantity)
                FROM product_stock_distributions psd
                JOIN purchase_order_vendor_delivery pod
                  ON psd.transactions_id = pod.id
                WHERE psd.deleted_at IS NULL
                  AND pod.purchase_order_vendor_id = pocd.purchase_order_vendor_id
              ), 0
            ) >= COALESCE(
              (
                SELECT 
                  SUM(popv.quantity)
                FROM purchase_order_product_vendors popv
                WHERE popv.purchase_order_vendor_id = pocd.purchase_order_vendor_id
              ), 0
            ) AS is_received
          FROM purchase_order_vendor_delivery pocd
          WHERE pocd.purchase_order_vendor_id = '${params.purchase_order_vendor_id}'
            AND pocd.deleted_at IS NULL
          LIMIT 1;        
        `);

      return this.success(result.rows[0], "Data found successfully");
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

module.exports = new PurchaseOrderVendorsDeliveryRepository();
