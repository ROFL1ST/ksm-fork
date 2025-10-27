const { ProductsHelper } = require("../../helper");
const {
  ProductsRepository,
  ProductDetailsRepository,
  ProductStockDistributionsRepository,
  ParameterRepository,
  PurchaseOrderTravelDocumentClientsRepository,
  ProductFollowUpRepository,
  AdminResponsibilitiesRepository,
  PurchaseOrderClientsRepository,
  ProductUnitsRepository,
  GlobalAnalyticRepository,
} = require("../../repository");
const {
  BlastProdutcsFollowUPTemplate,
} = require("../../template/WhatsApp.Template");
const { PaginationsGenerate } = require("../../utils/Paginate");

class ProductsService {
  async createProductService(params) {
    try {
      return await ProductsHelper.insertProductPurchaseOrder({
        ...params,
        is_inventory: true,
      });
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async updateProductService(params) {
    try {
      return await ProductsHelper.updateProductHelper(params);
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async deleteProductService(params) {
    try {
      const unit = await ProductUnitsRepository.getOneRepository({
        id: params.product_unit_id,
      });
      if (!unit.status) return unit;
      const { product_id, product_detail_id } = unit.response;
      // products
      await ProductsRepository.updateRepository(
        {
          deleted_at: new Date(),
          deleted_by: params.id,
        },
        { id: product_id }
      );
      // product detail
      await ProductDetailsRepository.updateRepository(
        {
          deleted_at: new Date(),
          deleted_by: params.id,
        },
        { id: product_detail_id }
      );
      // product unit
      await ProductUnitsRepository.updateRepository(
        {
          deleted_at: new Date(),
          deleted_by: params.id,
        },
        {
          id: params.product_unit_id,
        }
      );
      return {
        status: true,
        response: null,
        messages: "Successfully processed product data",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async getProductDetailsService(params) {
    try {
      return await ProductDetailsRepository.getByConditionRepository({
        product_id: params.product_id,
      });
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async getProductDetailService(params) {
    try {
      const pview =
        await ProductStockDistributionsRepository.GetOneProductDistributionRepository(
          { product_unit_id: params.product_unit_id }
        );
      return pview;
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async getProductRestocksService(params) {
    try {
      const paginate = PaginationsGenerate(params);
      const response =
        await ProductStockDistributionsRepository.getRestockProducts(paginate);
      let total_data = response.response.length ? response.response[0].exx : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;

      return {
        status: true,
        response: {
          total_data,
          total_page,
          products: response.response,
        },
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async getProductsService(params) {
    try {
      const paginate = await PaginationsGenerate(params);
      const response = await ProductsRepository.getProductViewRepository(
        paginate
      );
      let total_data = response.response.length ? response.response[0].exx : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;
      const { response: header } =
        await GlobalAnalyticRepository.getProductsInventory(params);
      return {
        status: true,
        response: {
          total_data,
          total_page,
          header,
          products: response.response,
        },
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }

  async ProductDemandRequestService(params) {
    try {
      const request = params.request;
      const { response: admin } =
        await AdminResponsibilitiesRepository.getAllByCodeReponsibilityRepository(
          { code: "FINANCE" }
        );

      const purchaseOrder =
        await PurchaseOrderClientsRepository.getOneRepository({
          id: params.purchase_order_client_id,
        });
      if (!purchaseOrder.status) return purchaseOrder;
      let message = `
      Kode PO : *${purchaseOrder.response.purchase_order_client_code || "-"}*
      Tanggal : *${new Date().toLocaleDateString("id-ID")}*

      Berikut daftar produk yang perlu dibeli:\n`;

      for (let i = 0; i < request.length; i++) {
        const { response: unit } =
          await ProductStockDistributionsRepository.GetOneProductDistributionRepository(
            {
              product_unit_id: request[i].product_unit_id,
            }
          );
        message += `
        *${i + 1}). ${request[i].name}*
        📦 Stok Sekarang : *${unit.total_quantity}*
        🧾 Permintaan Stok : *${request[i].quantity}*
        🏷️ Kode Unit : *${unit.unit_code}*
        ──────────────────────────`;
        const productFollowUp =
          await ProductFollowUpRepository.getOneRepository({
            purchase_order_client_id: params.purchase_order_client_id,
            product_unit_id: request[i].product_unit_id,
          });

        if (!productFollowUp.status)
          await ProductFollowUpRepository.createRepository({
            product_detail_id: request[i].product_detail_id,
            request_stock: request[i].quantity,
            status_code: "FOLLOW_UP_STOCK",
            purchase_order_client_id: params.purchase_order_client_id,
            product_unit_id: request[i].product_unit_id,
            created_by: params.id,
          });
        if (productFollowUp.status)
          await ProductFollowUpRepository.updateRepository(
            {
              product_detail_id: request[i].product_detail_id,
              request_stock: request[i].quantity,
              status_code: "FOLLOW_UP_STOCK",
              purchase_order_client_id: params.purchase_order_client_id,
              product_unit_id: request[i].product_unit_id,
              created_by: params.id,
            },
            {
              purchase_order_client_id: params.purchase_order_client_id,
              product_unit_id: request[i].product_unit_id,
            }
          );
      }

      // blast request by WhatsApp
      for (let i = 0; i < admin.length; i++) {
        await BlastProdutcsFollowUPTemplate({
          name: admin[i].name,
          phone: admin[i].phone,
          demand: message,
        });
      }

      return {
        status: true,
        response: null,
        messages: "Successfully Send",
      };
    } catch (e) {
      console.log(e);
      return { status: false, response: null, messages: e.message };
    }
  }

  async GetProductsDistributionService(params) {
    try {
      const paginate = PaginationsGenerate(params);

      const response =
        await ProductStockDistributionsRepository.GetProductDistributions(
          paginate
        );
      let total_data = response.response.length ? response.response[0].exx : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;

      if (total_data > 0 && total_page === 0) total_page = 1;
      const distributionCode =
        await ParameterRepository.getParamLookupValuesRepository({
          lookup_code: "PRODUCT_DISTRIBUTION_STATUS",
        });
      const transactionCode =
        await ParameterRepository.getParamLookupValuesRepository({
          lookup_code: "PRODUCT_DISTRIBUTION_TYPE",
        });

      const { response: header } =
        await GlobalAnalyticRepository.getProductsIn();
      return {
        status: true,
        response: {
          total_data,
          total_page,
          header,
          status_distribution_code: distributionCode.response,
          transaction_code: transactionCode.response,
          products: response.response,
        },
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async DistributionProductsService(params) {
    try {
      return await ProductsHelper.ProductDistributionOutTravelClient(params);
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async getProductFollowUPService() {
    try {
      return await ProductFollowUpRepository.getAllGroupRepository();
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async getProductFollowUPDetailService(params) {
    try {
      return await ProductFollowUpRepository.getByUnitIDRepository(params);
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
}

module.exports = new ProductsService();
