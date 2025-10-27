const _ = require("../../config/DB");

class GlobalAnalyticRepository {
  // --- MASTER ---
  async getProductsInventory(params) {
    try {
      let query = `
        SELECT
          (SELECT COALESCE(COUNT(*),0) FROM product_details WHERE deleted_at IS NULL) AS total_products,
          (SELECT COALESCE(COUNT(*),0) FROM view_products_follow_up) AS total_product_follow_up
      `;

      if (params?.start_date && params?.end_date) {
        query += `
          WHERE created_at BETWEEN '${params.start_date}'::timestamptz AND '${params.end_date}'::timestamptz
        `;
      } else if (params?.periode) {
        query += `
          WHERE TO_CHAR(created_at, 'Mon-YYYY') = '${params.periode}'
        `;
      }

      const result = await _.raw(query);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- PRODUCTS IN ---
  async getProductsIn(params) {
    try {
      const result = await _.raw(`
        SELECT 
          (SELECT COALESCE(COUNT(*),0) FROM purchase_order_vendors WHERE progress_type_code in ('WAREHOUSE_LOADING','IN_PROGRESS_ORDER')) AS total_order_receive_on_progress,
          (SELECT COALESCE(COUNT(*),0) FROM purchase_order_vendors WHERE progress_type_code = 'ORDER_RECEIVED_WAREHOUSE') AS total_order_received;
      `);
      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- FINANCE ---
  async getFinanceSummary(params) {
    try {
      let filter = "";
      if (params?.start_date && params?.end_date) {
        filter = `AND created_at BETWEEN '${params.start_date}'::timestamptz AND '${params.end_date}'::timestamptz`;
      } else if (params?.periode) {
        filter = `AND TO_CHAR(created_at, 'Mon-YYYY') = '${params.periode}'`;
      }

      const result = await _.raw(`
        SELECT 
          (SELECT COALESCE(SUM(total), 0) FROM finance WHERE finance_code = 'EXPENSE' ${filter}) AS total_expense,
          (SELECT COALESCE(SUM(total), 0) FROM finance WHERE finance_code = 'INCOME' ${filter}) AS total_income,
          (SELECT COALESCE(SUM(final_total), 0) FROM purchase_order_clients WHERE status_trx_code = 'PAID' ${filter}) AS total_income_confirm,
          (SELECT COALESCE(SUM(ppn_amount), 0) AS total_tax_invoice FROM purchase_order_product_clients) AS total_tax_invoice
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- FAKTUR PAJAK ---
  async getTaxInvoice(params) {
    try {
      const result = await _.raw(`
        SELECT COALESCE(SUM(ppn_amount), 0) AS total_tax_invoice
        FROM purchase_order_product_clients
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- PURCHASE ORDER VENDORS ---
  async getTotalPoVendors(params) {
    try {
      const result = await _.raw(`
        SELECT COALESCE(COUNT(*),0) AS total_po_vendors
        FROM purchase_order_vendors
        WHERE deleted_at IS NULL
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- PURCHASE ORDER CLIENTS ---
  async getTotalPoClients(params) {
    try {
      const result = await _.raw(`
        SELECT COALESCE(COUNT(*),0) AS total_po_clients
        FROM purchase_order_clients
        WHERE deleted_at IS NULL
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- CLIENTS ---
  async getTotalClients(params) {
    try {
      const result = await _.raw(`
        SELECT COALESCE(COUNT(*),0) AS total_clients
        FROM clients
        WHERE deleted_at IS NULL
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- VENDORS ---
  async getTotalVendors(params) {
    try {
      const result = await _.raw(`
        SELECT COALESCE(COUNT(*),0) AS total_vendors
        FROM vendors
        WHERE deleted_at IS NULL
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- TOTAL ORDER UNPAID COMPANY ---
  async getTotalPoVendorUnpaid() {
    try {
      const result = await _.raw(`
        SELECT COALESCE(COUNT(*),0) AS total_po_vendor_un_paid
        FROM purchase_order_vendors
        WHERE deleted_at IS NULL AND status_trx_code = 'PENDING'
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }
  // --- TOTAL ORDER UNPAID COMPANY AMOUNT ---
  async getTotalPoVendorUnpaidAmount() {
    try {
      const result = await _.raw(`
        SELECT COALESCE(SUM(pov.final_total)) AS total_po_vendor_un_paid_amount
        FROM purchase_order_vendors as pov
        WHERE pov.deleted_at IS NULL AND pov.status_trx_code = 'PENDING'
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- TOTAL CLIENTS UNPAID ---
  async getTotalPoClientUnpaid(params) {
    try {
      const result = await _.raw(`
        SELECT COALESCE(COUNT(*),0) AS total_po_client_un_paid
        FROM purchase_order_clients
        WHERE deleted_at IS NULL AND status_trx_code = 'PENDING'
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- DRIVER PERSONAL ---
  async getDriverStats(params) {
    try {
      const result = await _.raw(
        `
          SELECT COALESCE(COUNT(*),0) AS total_my_delivery
          FROM purchase_order_clients_delivery
          WHERE driver_id = ?
        `,
        [params.driver_id]
      );

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- SALES PERSONAL ---
  async getSalesStats(params) {
    try {
      const result = await _.raw(
        `
          SELECT COALESCE(COUNT(*),0) AS total_my_sell
          FROM purchase_order_clients 
          WHERE deleted_at is null AND created_by = ?
        `,
        [params.user_id]
      );

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  // --- ADMIN DASHBOARD ---
  async getAdminStats(params) {
    try {
      const result = await _.raw(`
        SELECT 
          (SELECT COALESCE(COUNT(*),0) FROM purchase_order_clients WHERE deleted_at IS NULL AND progress_type_code = 'FOLLOW_UP') AS total_follow_up_po_client,
          (SELECT COALESCE(COUNT(*),0) FROM purchase_order_clients WHERE deleted_at IS NULL AND progress_type_code = 'DONE') AS total_done_po_client
      `);

      return {
        status: true,
        response: result.rows[0],
        messages: "Data found successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: null, messages: e.message };
    }
  }
  // --- DRIVER ---
  async getDriverDeliveryStatus(params) {
    const result = await _.raw(
      `
  SELECT 
    COALESCE(SUM(CASE WHEN poc.progress_type_code = 'DONE' THEN 1 ELSE 0 END), 0) AS total_done,
    COALESCE(SUM(CASE WHEN poc.progress_type_code = 'HAS_NOT_SENT' THEN 1 ELSE 0 END), 0) AS total_has_not_yet,
    COALESCE(SUM(CASE WHEN poc.progress_type_code = 'SENDING' THEN 1 ELSE 0 END), 0) AS total_sending
  FROM purchase_order_clients_delivery pocd
  JOIN purchase_order_clients poc 
    ON pocd.purchase_order_client_id = poc.id
  WHERE pocd.driver_id = ?
  `,
      [params.user_id]
    );

    return {
      status: true,
      response: result.rows[0],
      message: "Driver delivery status fetched successfully",
    };
  }
}

module.exports = new GlobalAnalyticRepository();
