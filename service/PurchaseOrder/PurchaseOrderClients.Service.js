const { PurchaseOrderClientsHelper } = require("../../helper");
const {
  PurchaseOrderClientsRepository,
  ProductsRepository,
  ClientsRepository,
  ParameterRepository,
  PurchaseOrderProductClientsRepository,
  PurchaseOrderDocumentsRepository,
  PurchaseOrderClientsDeliveryRepository,
  GlobalAnalyticRepository,
} = require("../../repository");
const { dateTimeNowID } = require("../../utils/Moment");
const {
  Paginate: { PaginationsGenerate },
  Upload: { UploadFile },
  Uuid: { uuids },
} = require("../../utils");

class PurchaseOrderClientService {
  async GetServiceSales(params) {
    try {
      const paginate = await PaginationsGenerate(params);
      params.size = paginate.size;
      params.page = paginate.page;
      const [purchaseOrderClient, progressTypeCode, statusTrx, typeTrx] =
        await Promise.all([
          PurchaseOrderClientsRepository.getAllByCreatedByRepository(params),
          ParameterRepository.getParamLookupValuesRepository({
            lookup_code: "STATUS_PURCHASE_ORDER_CLIENTS",
          }),
          ParameterRepository.getParamLookupValuesRepository({
            lookup_code: "STATUS_TRX",
          }),
          ParameterRepository.getParamLookupValuesRepository({
            lookup_code: "TYPE_TRX",
          }),
        ]);
      let total_data = purchaseOrderClient.response.length
        ? purchaseOrderClient.response[0].exx
        : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;
      return {
        status: true,
        response: {
          total_data,
          total_page,
          data: purchaseOrderClient.response,
          progressType: progressTypeCode.response,
          statusTrx: statusTrx.response,
          typeTrx: typeTrx.response,
        },
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async GetService(params) {
    try {
      const paginate = await PaginationsGenerate(params);
      params.size = paginate.size;
      params.page = paginate.page;
      const [purchaseOrderClient, progressTypeCode, statusTrx, typeTrx] =
        await Promise.all([
          PurchaseOrderClientsRepository.getAllRepository(params),
          ParameterRepository.getParamLookupValuesRepository({
            lookup_code: "STATUS_PURCHASE_ORDER_CLIENTS",
          }),
          ParameterRepository.getParamLookupValuesRepository({
            lookup_code: "STATUS_TRX",
          }),
          ParameterRepository.getParamLookupValuesRepository({
            lookup_code: "TYPE_TRX",
          }),
        ]);
      let total_data = purchaseOrderClient.response.length
        ? purchaseOrderClient.response[0].exx
        : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;
      return {
        status: true,
        response: {
          total_data,
          total_page,
          data: purchaseOrderClient.response,
          progressType: progressTypeCode.response,
          statusTrx: statusTrx.response,
          typeTrx: typeTrx.response,
        },
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }

  async GetAssetsDataService() {
    try {
      const [Clients, Products] = await Promise.all([
        ClientsRepository.getAllRepository(),
        ProductsRepository.getAllRepository(),
      ]);
      return {
        status: true,
        response: {
          clients: Clients.response,
          products: Products.response,
        },
        messages: "Successfully get Assets",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async GetOneService(params) {
    try {
      const [purchaseOrderClient, products] = await Promise.all([
        PurchaseOrderClientsRepository.getDetailOneRepository(params),
        PurchaseOrderProductClientsRepository.getOneDetailRepository(params),
      ]);

      if (!purchaseOrderClient.status) return purchaseOrderClient;
      purchaseOrderClient.response.products = products.response;
      return purchaseOrderClient;
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PostService(params) {
    try {
      return await PurchaseOrderClientsHelper.insertPurchaseOrder(params);
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async UpdateService(params) {
    try {
      return await PurchaseOrderClientsHelper.updatePurchaseOrder(params);
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async TravelDocumentService(params) {
    try {
      const [header, products] = await Promise.all([
        PurchaseOrderClientsRepository.getOneRepository({
          id: params.purchase_order_client_id,
          deleted_at: null,
        }),
        PurchaseOrderProductClientsRepository.getOneDetailRepository({
          purchase_order_client_id: params.purchase_order_client_id,
          deleted_at: null,
        }),
      ]);
      if (!header.status) return header;
      if (!products.status) return products;
      const { purchase_order_client_code } = header.response;

      const stock =
        await PurchaseOrderProductClientsRepository.getCountQuantityDetailRepository(
          params
        );
      // Travel Document Client
      const travelDocument =
        await PurchaseOrderClientsHelper.TravelDocumentClientsChecking({
          purchase_order_client_id: params.purchase_order_client_id,
          purchase_order_client_code: purchase_order_client_code,
          driver_id: params.driver_id,
          id: params.id,
        });

      // address client
      const address =
        await PurchaseOrderClientsHelper.GetAddresClientDetailByCoordinate({
          client_id: header.response.client_id,
        });
      if (!address.status) return address;

      let info = {
        title: "Surat Jalan",
        date: dateTimeNowID(),
        number: travelDocument.response.travel_code,
        expedition: travelDocument.response.driver_name,
        poNumber: purchase_order_client_code,
      };
      return {
        status: true,
        response: {
          description: params.description,
          products: products.response,
          totals: stock.response,
          recipient: address.response,
          documentInfo: info,
        },
        messages: "Successfully get data",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }

  async DeleteService(params) {
    try {
      // purchase_order_clients
      const check = await PurchaseOrderClientsRepository.getOneRepository({
        id: params.purchase_order_client_id,
      });
      if (!check.status)
        return { status: false, response: null, messages: "Data Not Found" };

      await PurchaseOrderClientsRepository.updateRepository(
        { deleted_at: new Date(), deleted_by: params.id },
        { id: params.purchase_order_client_id }
      );
      await PurchaseOrderProductClientsRepository.updateRepository(
        { deleted_at: new Date(), deleted_by: params.id },
        { purchase_order_client_id: params.purchase_order_client_id }
      );

      return { status: true, response: null, messages: "Success Deleted Data" };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PurchaseOrderTravelDocumentDescriptionService(params) {
    try {
      const checking = await PurchaseOrderDocumentsRepository.getOneRepository({
        purchase_order_id: params.purchase_order_client_id,
      });
      if (!checking.status)
        await PurchaseOrderDocumentsRepository.createRepository({
          purchase_order_id: purchase_order_client_id,
          description: params.description,
          type_code: params.type_code,
          status_code: params.status_code,
        });
      if (checking.status)
        await PurchaseOrderDocumentsRepository.updateRepository(
          {
            purchase_order_id: purchase_order_client_id,
            description: params.description,
            type_code: params.type_code,
            status_code: params.status_code,
          },
          { purchase_order_id: params.purchase_order_client_id }
        );
      return { status: true, response: null, messages: "Success Updated Data" };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async GetPurchaseOrderTravelDocumentDescriptionService(params) {
    try {
      const validationStock =
        await PurchaseOrderClientsHelper.GetCheckingStockByPurchaseOderClientID(
          params
        );
      if (!validationStock.status) return validationStock;
      const response =
        await PurchaseOrderClientsDeliveryRepository.getOneRepository({
          purchase_order_client_id: params.purchase_order_client_id,
        });
      if (!response.status)
        await PurchaseOrderClientsRepository.updateRepository(
          {
            progress_type_code: "VALIDATION_STOCK",
          },
          { id: params.purchase_order_client_id }
        );
      return {
        status: true,
        response: null,
        messages: "Validation Valid as Stock",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async getByDriverIDService(params) {
    try {
      const paginate = PaginationsGenerate(params);
      const response =
        await PurchaseOrderClientsDeliveryRepository.getByDriverIDRepository(
          paginate
        );
      let total_data = response.response.length ? response.response[0].exx : 0;
      let total_page =
        total_data > 0 ? Math.ceil(total_data / paginate.size) : 0;
      const { response: header } =
        await GlobalAnalyticRepository.getDriverDeliveryStatus({
          user_id: params.id,
        });
      return {
        status: true,
        response: {
          total_data,
          total_page,
          header,
          task: response.response,
        },
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async getTrvelDocumentDetailService(params) {
    try {
      return PurchaseOrderClientsHelper.TravelDetailOutClient(params);
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async updateTrvelDocumentDetailService(params) {
    try {
      const checking = await PurchaseOrderClientsRepository.getOneRepository({
        id: params.purchase_order_client_id,
      });
      if (!checking.status) return checking;

      // purchase order client
      await PurchaseOrderClientsRepository.updateRepository(
        {
          progress_type_code: params.progress_type_code,
        },
        { id: params.purchase_order_client_id }
      );
      await PurchaseOrderClientsDeliveryRepository.updateRepository(
        {
          updated_at: new Date(),
          updated_by: params.id,
        },
        { purchase_order_client_id: params.purchase_order_client_id }
      );
      // image
      if (params.progress_type_code === "DONE")
        await PurchaseOrderClientsHelper.updateDeliveryStatusDone(params);

      return {
        status: true,
        response: null,
        messages: "Succesfully Updated Delivery",
      };
    } catch (e) {
      console.log(e);
      return { status: false, response: e, messages: e.message };
    }
  }
}

module.exports = new PurchaseOrderClientService();
