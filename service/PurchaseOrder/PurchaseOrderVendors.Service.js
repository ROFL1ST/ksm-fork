const { PurchaseOrderVendorsHelper, ProductsHelper } = require("../../helper");
const {
  PurchaseOrderVendorsRepository,
  ProductsRepository,
  ParameterRepository,
  PurchaseOrderDocumentsRepository,
  VendorsRepository,
  PurchaseOrderProductVendorsRepository,
  PurchaseOrderVendorsDeliveryRepository,
  ProductStockDistributionsRepository,
  AdminsRepository,
  GlobalAnalyticRepository,
} = require("../../repository");
const { dateTimeNowIDReq } = require("../../utils/Moment");
const {
  Paginate: { PaginationsGenerate },
  Upload: { GenerateImage },
  Uuid: { uuids },
} = require("../../utils");
class PurchaseOrderVendorsService {
  async GetService(params) {
    try {
      const paginate = await PaginationsGenerate(params);
      params.size = paginate.size;
      params.page = paginate.page;
      const [
        purchaseOrderClient,
        progressTypeCode,
        statusTrx,
        typeTrx,
        totalPo,
        totalUnPaid,
        totalUnPaidAmount,
      ] = await Promise.all([
        PurchaseOrderVendorsRepository.getAllRepository(params),
        ParameterRepository.getParamLookupValuesRepository({
          lookup_code: "STATUS_PURCHASE_ORDER_VENDORS",
        }),
        ParameterRepository.getParamLookupValuesRepository({
          lookup_code: "STATUS_TRX",
        }),
        ParameterRepository.getParamLookupValuesRepository({
          lookup_code: "TYPE_TRX",
        }),
        GlobalAnalyticRepository.getTotalPoVendors(),
        GlobalAnalyticRepository.getTotalPoVendorUnpaid(),
        GlobalAnalyticRepository.getTotalPoVendorUnpaidAmount(),
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
          header: {
            total_po_vendors: totalPo.response.total_po_vendors,
            total_po_vendor_un_paid:
              totalUnPaid.response.total_po_vendor_un_paid,
            total_po_vendor_un_paid_amount:
              totalUnPaidAmount.response.total_po_vendor_un_paid_amount,
          },
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

  // {GET HISTORY SHOPPING}
  async GetAssetsDataService() {
    try {
      const [vendors, Products] = await Promise.all([
        VendorsRepository.getAllRepository(),
        ProductsRepository.getAllRepository(),
      ]);
      return {
        status: true,
        response: {
          vendors: vendors.response,
          products: Products.response,
        },
        messages: "Successfully get Assets",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async ProductsReceivedService(params) {
    try {
      const checking = await PurchaseOrderVendorsRepository.getOneRepository({
        purchase_order_vendor_code: params.purchase_order_vendor_code,
      });
      if (!checking.status) return checking;

      const [received, historyAddStock] = await Promise.all([
        PurchaseOrderProductVendorsRepository.GetReceivedDistributionRepository(
          {
            purchase_order_vendor_id: checking.response.id,
            status_distribution_code: "ADD_STOCK",
          }
        ),
        PurchaseOrderProductVendorsRepository.GetReceivedDistributionRepository(
          {
            purchase_order_vendor_id: checking.response.id,
            status_distribution_code: "ADD_STOCK",
          }
        ),
      ]);
      return {
        status: true,
        response: {
          received: received.response,
          historyAddStock: historyAddStock.response,
        },
        messages: "Successfully get Assets",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PurchaseOrderProductsDeliveryReceived(params) {
    try {
      const checking =
        await PurchaseOrderVendorsRepository.getDetailOneRepository({
          purchase_order_vendor_id: params.purchase_order_vendor_id,
        });
      if (!checking.status) return checking;

      const delivery =
        await PurchaseOrderVendorsDeliveryRepository.getAllByPOVendorIDRepository(
          params
        );

      if (!delivery.response) return delivery;
      let item = delivery.response;
      for (let i = 0; i < item.length; i++) {
        const detailDelivery =
          await ProductStockDistributionsRepository.getDistributionByTrxIDRepository(
            {
              transactions_id: item[i].id,
              purchase_order_vendor_id: item[i].purchase_order_vendor_id,
            }
          );
        item[i].detail = detailDelivery.response;
      }
      checking.response.driver = item;
      return checking;
    } catch (e) {
      console.log(e);
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PurchaseOrderProductsDeliveryDelete(params) {
    try {
      const checking =
        await PurchaseOrderVendorsDeliveryRepository.getOneRepository({
          id: params.purchase_order_vendor_delivery_id,
        });
      if (!checking.status) return checking;
      // delivery
      await PurchaseOrderVendorsDeliveryRepository.updateRepository(
        {
          deleted_at: new Date(),
          deleted_by: params.id,
        },
        {
          id: params.purchase_order_vendor_delivery_id,
        }
      );
      // delete product stock distribution
      await ProductStockDistributionsRepository.DeleteProductDistributionRepository(
        { transactions_id: params.purchase_order_vendor_delivery_id }
      );
      return {
        status: true,
        response: null,
        messages: "Successfully Deleted Data",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PurchaseOrderProductsDeliveryUpdate(params) {
    try {
      const purchaseOrder =
        await PurchaseOrderVendorsRepository.getOneRepository({
          id: params.purchase_order_vendor_id,
          deleted_at: null,
        });
      if (!purchaseOrder.status) return purchaseOrder;

      // driver vendor info
      let { driver_info, items } = params;

      if (!driver_info.driver_photo.startsWith("https")) {
        const driver_photo = await GenerateImage({
          path: driver_info.driver_photo,
          key: "proof_delivery_vendor_po/",
        });
        driver_info.driver_photo = driver_photo.response;
      }

      const delivery =
        await PurchaseOrderVendorsDeliveryRepository.updateRepository(
          {
            purchase_order_vendor_id: params.purchase_order_vendor_id,
            driver_name: driver_info.driver_name,
            driver_phone: driver_info.driver_phone,
            path: driver_info.driver_photo,
            updated_at: new Date(),
            updated_by: params.id,
          },
          {
            id: params.purchase_order_vendor_delivery_id,
          }
        );
      if (!delivery.status) return delivery;

      // delete distribution stock
      const deletedDistribution =
        await ProductStockDistributionsRepository.DeleteProductDistributionRepository(
          { transactions_id: params.purchase_order_vendor_delivery_id }
        );
      if (!deletedDistribution.status) return deletedDistribution;
      // distribution stock x purchase order delivery detail
      return await ProductsHelper.PurchaseOrderInsertDistributionDelivery({
        items: items,
        purchase_order_vendor_delivery_id:
          params.purchase_order_vendor_delivery_id,
        purchase_order_vendor_id: params.purchase_order_vendor_id,
        transaction_code: "ADD_STOCK",
        status_distribution_code: "ON_HAND",
        source_table: "purchase_order_vendor_delivery",
        created_by: params.id,
      });
    } catch (e) {
      console.log(e);
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PurchaseOrderProductsDelivery(params) {
    try {
      const [header, products] = await Promise.all([
        PurchaseOrderVendorsRepository.getDetailOneRepository({
          purchase_order_vendor_id: params.purchase_order_vendor_id,
          deleted_at: null,
        }),
        ProductStockDistributionsRepository.getDetailProductsReceivedRepository(
          {
            purchase_order_vendor_id: params.purchase_order_vendor_id,
            deleted_at: null,
          }
        ),
      ]);
      if (!header.status) return header;
      header.response.products = products.response;
      return header;
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async CreatePurchaseOrderProductsDelivery(params) {
    try {
      const purchaseOrder =
        await PurchaseOrderVendorsRepository.getOneRepository({
          id: params.purchase_order_vendor_id,
          deleted_at: null,
        });
      if (!purchaseOrder.status) return purchaseOrder;

      // driver vendor info
      const { driver_info, items } = params;
      let path = await GenerateImage({
        path: driver_info.driver_photo,
        key: "proof_delivery_vendor_po/",
      });
      const ID = uuids();
      const generate =
        await PurchaseOrderVendorsDeliveryRepository.getCodePORepository();
      const delivery =
        await PurchaseOrderVendorsDeliveryRepository.createRepository({
          id: ID,
          purchase_order_vendor_id: params.purchase_order_vendor_id,
          purchase_order_vendor_delivery_code: generate.response.new_code,
          driver_name: driver_info.driver_name,
          driver_phone: driver_info.driver_phone,
          path: path.response,
          created_by: params.id,
        });
      if (!delivery.status) return delivery;

      // distribution stock x purchase order delivery detail
      const process =
        await ProductsHelper.PurchaseOrderInsertDistributionDelivery({
          items: items,
          purchase_order_vendor_delivery_id: ID,
          purchase_order_vendor_id: params.purchase_order_vendor_id,
          transaction_code: "ADD_STOCK",
          status_distribution_code: "ON_HAND",
          source_table: "purchase_order_vendor_delivery",
          created_by: params.id,
        });
      return {
        status: true,
        response: null,
        messages: "Successfully created Product Delivery",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async GetOneService(params) {
    try {
      const [purchaseOrderVendor, products] = await Promise.all([
        PurchaseOrderVendorsRepository.getDetailOneRepository(params),
        PurchaseOrderProductVendorsRepository.getOneDetailRepository(params),
      ]);
      if (!purchaseOrderVendor.status) return purchaseOrderVendor;
      purchaseOrderVendor.response.products = products.response;
      return purchaseOrderVendor;
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PostService(params) {
    try {
      return await PurchaseOrderVendorsHelper.insertPurchaseOrder(params);
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async UpdateService(params) {
    try {
      return await PurchaseOrderVendorsHelper.updatePurchaseOrder(params);
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async TravelDocumentService(params) {
    try {
      const [header, products] = await Promise.all([
        PurchaseOrderVendorsRepository.getOneRepository({
          id: params.purchase_order_vendor_id,
          deleted_at: null,
        }),
        PurchaseOrderProductVendorsRepository.getOneDetailRepository({
          purchase_order_vendor_id: params.purchase_order_vendor_id,
          deleted_at: null,
        }),
      ]);
      if (!header.status) return header;
      if (!products.status) return products;
      const { purchase_order_vendor_code, send_date, input_date } =
        header.response;

      const sumer =
        await PurchaseOrderProductVendorsRepository.getSumCurrencyPriceDetailRepository(
          params
        );

      // address client
      const address =
        await PurchaseOrderVendorsHelper.GetAddresClientDetailByCoordinate({
          vendor_id: header.response.vendor_id,
        });
      if (!address.status) return address;

      let info = {
        title: "Purchase Order",
        input_date: dateTimeNowIDReq(input_date),
        send_date: dateTimeNowIDReq(send_date),
        po_number: purchase_order_vendor_code,
      };
      const created_by = await AdminsRepository.getOneRepository({
        id: params.id,
      });
      return {
        status: true,
        response: {
          description: params.description,
          products: products.response,
          totals: sumer.response,
          recipient: address.response,
          documentInfo: info,
          signatures: [{ title: "Pengadaan", name: created_by.response.name }],
        },
        messages: "Successfully get data",
      };
    } catch (e) {
      return { status: false, response: null, messages: e.message };
    }
  }
  async TravelDocumentDeliveryVendorService(params) {
    try {
      const [header, products, receivedBy] = await Promise.all([
        PurchaseOrderVendorsRepository.getOneRepository({
          id: params.purchase_order_vendor_id,
          deleted_at: null,
        }),
        ProductStockDistributionsRepository.getDetailProductsReceivedByDeliveryIDRepository(
          params
        ),
        PurchaseOrderVendorsDeliveryRepository.getOneActionDeliveryVendorRepository(
          {
            purchase_order_vendor_delivery_id:
              params.purchase_order_vendor_delivery_id,
          }
        ),
      ]);

      if (!header.status) return header;
      if (!products.status) return products;
      if (!receivedBy.status) return receivedBy;
      const { purchase_order_vendor_code, input_date } = header.response;
      const { created_by, driver_name } = receivedBy.response;

      // address client
      const address =
        await PurchaseOrderVendorsHelper.GetAddresClientDetailByCoordinate({
          vendor_id: header.response.vendor_id,
        });
      if (!address.status) return address;

      let info = {
        title: "Tanda Terima Barang",
        input_date: dateTimeNowIDReq(input_date),
        send_date: dateTimeNowIDReq(new Date()),
        po_number: purchase_order_vendor_code,
      };

      return {
        status: true,
        response: {
          description: params.description,
          products: products.response,
          recipient: address.response,
          signatures: [
            { title: "Admin Gudang", name: created_by },
            { title: "Driver Vendor", name: driver_name },
          ],
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
      const check = await PurchaseOrderVendorsRepository.getOneRepository({
        id: params.purchase_order_vendor_id,
      });
      if (!check.status)
        return { status: false, response: null, messages: "Data Not Found" };

      await PurchaseOrderVendorsRepository.updateRepository(
        { deleted_at: new Date(), deleted_by: params.id },
        { id: params.purchase_order_vendor_id }
      );
      await PurchaseOrderProductVendorsRepository.updateRepository(
        { deleted_at: new Date(), deleted_by: params.id },
        { purchase_order_vendor_id: params.purchase_order_vendor_id }
      );

      return { status: true, response: null, messages: "Success Deleted Data" };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async PurchaseOrderTravelDocumentDescriptionService(params) {
    try {
      const checking = await PurchaseOrderDocumentsRepository.getOneRepository({
        purchase_order_id: params.purchase_order_vendor_id,
      });
      if (!checking.status)
        await PurchaseOrderDocumentsRepository.createRepository({
          purchase_order_id: purchase_order_vendor_id,
          description: params.description,
          type_code: params.type_code,
          status_code: params.status_code,
        });
      if (checking.status)
        await PurchaseOrderDocumentsRepository.updateRepository(
          {
            purchase_order_id: purchase_order_vendor_id,
            description: params.description,
            type_code: params.type_code,
            status_code: params.status_code,
          },
          { purchase_order_id: params.purchase_order_vendor_id }
        );
      return { status: true, response: null, messages: "Success Updated Data" };
    } catch (e) {
      return { status: false, response: null, messages: e.messages };
    }
  }
  async GetPurchaseOrderTravelDocumentDescriptionService(params) {
    try {
      const validationStock =
        await PurchaseOrderVendorsHelper.GetCheckingStockByPurchaseOderClientID(
          params
        );
      if (!validationStock.status) return validationStock;
      // const response = await PurchaseOrderDocumentsRepository.getOneRepository({
      //   purchase_order_id: params.purchase_order_vendor_id,
      // });
      await PurchaseOrderVendorsRepository.updateRepository(
        {
          progress_type_code: "VALIDATION_STOCK",
        },
        { id: params.purchase_order_vendor_id }
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
}

module.exports = new PurchaseOrderVendorsService();
