const {
  FinanceRepository,
  GlobalAnalyticRepository,
} = require("../../repository");

const {
  FormatCurrency: { CurrencyIDR },
} = require("../../utils");

class FinanceHelper {
  async createFinanceHelper(params) {
    try {
      console.log(params);
      const code = await FinanceRepository.getCodeRepository(params);
      if (params.path)
        params.path = (await GenerateImage({ path: params.path })).response;

      const result = await FinanceRepository.createRepository({
        finance_code: params.finance_code,
        input_date: params.input_date,
        description: params.description,
        category_code: params.category_code,
        reference: code.response.new_code,
        source_id: params.source_id,
        source_table: params.source_table,
        total: params.total,
        status_code: params.status_code,
        path: params.path,
        created_by: params.id,
      });
      return result;
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async updateFinanceHelper(params, condition) {
    try {
      if (params.path)
        params.path = (await GenerateImage({ path: params.path })).response;

      const result = await FinanceRepository.updateRepository(
        {
          finance_code: params.finance_code,
          input_date: params.input_date,
          description: params.description,
          category_code: params.category_code,
          total: params.total,
          status_code: params.status_code,
          path: params.path,
          updated_at: new Date(),
          updated_by: params.id,
        },
        condition
      );
      return result;
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async globalAnalyticResponsibilityHelper(params) {
    try {
      const responsibilities = params.responsibilities;
      let data = [];
      for (let i = 0; i < responsibilities.length; i++) {
        if (responsibilities[i].code === "SALES") {
          // mySell
          const Mysell = await GlobalAnalyticRepository.getSalesStats({
            user_id: params.id,
          });
          data.push({
            label: "Penjualan Saya",
            value: Mysell.response.total_my_sell,
          });
        } else if (responsibilities[i].code === "ADMIN") {
          const [vendorPO, clientPO] = await Promise.all([
            GlobalAnalyticRepository.getTotalPoVendors(params),
            GlobalAnalyticRepository.getTotalPoClients(params),
          ]);
          data.push({
            label: "Total Pembelian Produk",
            value: vendorPO.response.total_po_vendors,
          });
          data.push({
            label: "Total Penjualan Produk",
            value: clientPO.response.total_po_clients,
          });
        } else if (responsibilities[i].code === "FINANCE") {
          const [summary, taxInvoice] = await Promise.all([
            GlobalAnalyticRepository.getFinanceSummary(params),
            GlobalAnalyticRepository.getTaxInvoice(params),
          ]);
          data.push({
            label: "Total Pemasukan",
            value: CurrencyIDR(summary.response.total_income),
          });
          data.push({
            label: "Total Pengeluaran",
            value: CurrencyIDR(summary.response.total_expense),
          });
          data.push({
            label: "Total Pajak",
            value: CurrencyIDR(taxInvoice.response.total_tax_invoice),
          });
        } else if (responsibilities[i].code === "WAREHOSUE") {
          const productsInventory =
            await GlobalAnalyticRepository.getProductsIn(params);
          data.push({
            label: "Barang Loading",
            value: productsInventory?.response?.total_order_receive_on_progress,
          });
          data.push({
            label: "Barang Telah Sampai",
            value: productsInventory?.response?.total_order_received,
          });
        }
      }
      console.log(data);
      return {
        status: true,
        response: data,
        messages: "Successfully Get Dashboar",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async globalAnalyticHelper(params) {
    try {
      const [
        productsInventory,
        productsIn,
        financeSummary,
        fakturPajak,
        totalPoVendors,
        totalPoClients,
        totalClients,
        totalVendors,
      ] = await Promise.all([
        GlobalAnalyticRepository.getProductsInventory(params),
        GlobalAnalyticRepository.getProductsIn(params),
        GlobalAnalyticRepository.getFinanceSummary(params),
        GlobalAnalyticRepository.getFakturPajak(params),
        GlobalAnalyticRepository.getTotalPoVendors(params),
        GlobalAnalyticRepository.getTotalPoClients(params),
        GlobalAnalyticRepository.getTotalClients(params),
        GlobalAnalyticRepository.getTotalVendors(params),
      ]);

      const response = {
        productsInventory: productsInventory.response,
        productsIn: productsIn.response,
        financeSummary: financeSummary.response,
        fakturPajak: fakturPajak.response,
        totalPoVendors: totalPoVendors.response,
        totalPoClients: totalPoClients.response,
        totalClients: totalClients.response,
        totalVendors: totalVendors.response,
      };

      return {
        status: true,
        response,
        message: "All analytics loaded successfully",
      };
    } catch (e) {
      console.error(e);
      return { status: false, response: e, message: e.message };
    }
  }
}
module.exports = new FinanceHelper();
