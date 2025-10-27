const {
  ProductsRepository,
  ProductDetailsRepository,
  PurchaseOrderTravelDocumentClientsRepository,
  PurchaseOrderProductClientsRepository,
  ProductStockDistributionsRepository,
  ProductUnitsRepository,
  PurchaseOrderClientsDeliveryRepository,
  PurchaseOrderClientsRepository,
  PurchaseOrderVendorsDeliveryRepository,
  PurchaseOrderVendorsRepository,
} = require("../../repository");
const {
  WhatsAppTemplate: { BlastTravelDocumentDriverTemplate },
} = require("../../template");
const {
  Uuid: { uuids },
} = require("../../utils");

class ProductsHelper {
  async insertProductPurchaseOrder(params) {
    try {
      let { product_id, product_detail_id, name, description, id, unit_code } =
        params;
      let product_unit_id = null;
      // 1️⃣ Cek produk berdasarkan NAME
      const existingProduct =
        await ProductDetailsRepository.getDetailRepository({
          name,
          description,
        });
      if (existingProduct?.status) {
        product_id = existingProduct.response.product_id;
      } else {
        const createdProduct = await ProductsRepository.createRepository({
          name,
          created_by: id,
        });
        if (!createdProduct.status) return createdProduct;
        product_id = createdProduct.response.id;
      }

      if (existingProduct?.status) {
        product_detail_id = existingProduct.response.product_detail_id;
      } else {
        const { response: generate } =
          await ProductUnitsRepository.getCodePORepository();
        const createdDetail = await ProductDetailsRepository.createRepository({
          product_id,
          code: generate.new_code,
          description,
          created_by: id,
        });
        if (!createdDetail.status) return createdDetail;
        product_detail_id = createdDetail.response.id;
      }

      // 3️⃣ Cek product unit berdasarkan (product_detail_id + unit_code)
      const existingUnit = await ProductUnitsRepository.getOneRepository({
        product_detail_id,
        unit_code,
      });
      if (existingUnit.status) product_unit_id = existingUnit.response.id;
      if (!existingUnit?.status) {
        const createdUnit = await ProductUnitsRepository.createRepository({
          product_id,
          product_detail_id,
          unit_code,
          created_by: id,
        });
        if (!createdUnit.status) return createdUnit;

        // 4️⃣ Tambahkan distribusi stok awal
        await ProductStockDistributionsRepository.InsertProductDistributionRepository(
          {
            product_id,
            product_detail_id,
            product_unit_id: createdUnit.response.id,
            transactions_id: "-",
            transaction_code: "ADD_PRODUCT",
            source_table: "-",
            status_distribution_code: "NEW_PRODUCT",
            quantity: params.is_inventory ? params.total_quantity : 0,
            created_by: id,
          }
        );
        product_unit_id = createdUnit.response.id;
      }

      return {
        status: true,
        response: { product_id, product_detail_id, product_unit_id },
        messages: "Successfully processed product data",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async insertProductHelper(params) {
    try {
      let { name, description, id, unit_code } = params;

      let product_id = null;
      let product_detail_id = null;
      // 1️⃣ Cek produk berdasarkan NAME
      const existingProduct =
        await ProductDetailsRepository.getDetailRepository({
          name,
          description,
        });
      if (existingProduct?.status) {
        product_id = existingProduct.response.product_id;
      } else {
        const createdProduct = await ProductsRepository.createRepository({
          name,
          created_by: id,
        });
        if (!createdProduct.status) return createdProduct;
        product_id = createdProduct.response.id;
      }

      if (existingProduct?.status) {
        product_detail_id = existingProduct.response.product_detail_id;
      } else {
        const { response: generate } =
          await ProductUnitsRepository.getCodePORepository();
        const createdDetail = await ProductDetailsRepository.createRepository({
          product_id,
          code: generate.new_code,
          description,
          created_by: id,
        });
        if (!createdDetail.status) return createdDetail;
        product_detail_id = createdDetail.response.id;
      }

      // 3️⃣ Cek product unit berdasarkan (product_detail_id + unit_code)
      const existingUnit = await ProductUnitsRepository.getOneRepository({
        product_detail_id,
        unit_code,
      });

      if (!existingUnit?.status) {
        const createdUnit = await ProductUnitsRepository.createRepository({
          product_id,
          product_detail_id,
          unit_code,
          created_by: id,
        });
        if (!createdUnit.status) return createdUnit;

        // 4️⃣ Tambahkan distribusi stok awal
        await ProductStockDistributionsRepository.InsertProductDistributionRepository(
          {
            product_id,
            product_detail_id,
            product_unit_id: createdUnit.response.id,
            transactions_id: "-",
            transaction_code: "ADD_PRODUCT",
            source_table: "-",
            status_distribution_code: "NEW_PRODUCT",
            quantity: 0,
            created_by: id,
          }
        );
      }

      return {
        status: true,
        response: { product_id, product_detail_id },
        messages: "Successfully processed product data",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async updateProductHelper(params) {
    try {
      const {
        product_id,
        product_detail_id,
        product_unit_id,
        name,
        description,
        id,
        unit_code,
        quantity,
      } = params;

      const viewStock =
        await ProductStockDistributionsRepository.GetOneProductDistributionRepository(
          { product_unit_id }
        );
      if (!viewStock.status) return viewStock;
      let { total_quantity } = viewStock.response;
      // 1️⃣ Cek produk berdasarkan NAME
      const existingProduct = await ProductDetailsRepository.getOneRepository({
        id: product_id,
      });
      if (!existingProduct.status) return existingProduct;

      if (existingProduct?.status)
        await ProductsRepository.updateRepository(
          {
            name,
            updated_at: new Date(),
            updated_by: id,
          },
          { id: product_id }
        );
      const existingProductDetail =
        await ProductDetailsRepository.getOneRepository({
          id: product_detail_id,
        });
      if (!existingProductDetail.status) return existingProductDetail;

      if (existingProductDetail?.status)
        await ProductDetailsRepository.updateRepository(
          {
            description,
            updated_at: new Date(),
            updated_by: id,
          },
          { id: product_detail_id }
        );

      // 3️⃣ Cek product unit berdasarkan (product_detail_id + unit_code)
      const existingUnit = await ProductUnitsRepository.getOneAndNotRepository({
        product_detail_id,
        unit_code,
      });
      if (existingUnit.status)
        return {
          status: false,
          response: null,
          messages: `Sory this unit product already registered`,
        };
      if (!existingUnit?.status) {
        await ProductUnitsRepository.updateRepository(
          {
            unit_code,
            updated_at: new Date(),
            updated_by: params.id,
          },
          { id: product_unit_id }
        );
      }

      // distribution
      if (quantity !== total_quantity) {
        let total_final_quantity = quantity - total_quantity;
        if (total_final_quantity > 0) {
          await ProductStockDistributionsRepository.InsertProductDistributionRepository(
            {
              product_id,
              product_detail_id,
              product_unit_id: product_unit_id,
              transactions_id: "-",
              transaction_code: "ADJUSTMENT",
              source_table: "-",
              status_distribution_code: "UPDATE_PRODUCT",
              quantity: total_final_quantity,
              created_by: id,
            }
          );
        } else {
          await ProductStockDistributionsRepository.InsertProductDistributionRepository(
            {
              product_id,
              product_detail_id,
              product_unit_id: product_unit_id,
              transactions_id: "-",
              transaction_code: "ADJUSTMENT",
              source_table: "-",
              status_distribution_code: "UPDATE_PRODUCT",
              quantity: -total_quantity,
              created_by: id,
            }
          );
          await ProductStockDistributionsRepository.InsertProductDistributionRepository(
            {
              product_id,
              product_detail_id,
              product_unit_id: product_unit_id,
              transactions_id: "-",
              transaction_code: "ADJUSTMENT",
              source_table: "-",
              status_distribution_code: "UPDATE_PRODUCT",
              quantity: quantity,
              created_by: id,
            }
          );
        }
      }

      return {
        status: true,
        response: null,
        messages: "Successfully processed product data",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async ProductDistributionOutTravelClient(params) {
    try {
      const [travelDocumentClient, travelDocumentDelivery] = await Promise.all([
        PurchaseOrderTravelDocumentClientsRepository.getOneRepository({
          travel_code: params.travel_code,
        }),
        PurchaseOrderClientsDeliveryRepository.getOneDetailDeliveryRepository({
          travel_code: params.travel_code,
        }),
      ]);
      if (!travelDocumentClient.status) return travelDocumentClient;
      if (!travelDocumentDelivery.status) return travelDocumentDelivery;

      if (travelDocumentClient.response.distribution_status)
        return {
          status: false,
          response: null,
          messages: "This Code Has Been used",
        };
      const { purchase_order_client_id } = travelDocumentClient.response;

      const purchaseOrderProducts =
        await PurchaseOrderProductClientsRepository.getOneDetailRepository({
          purchase_order_client_id: purchase_order_client_id,
        });
      if (!purchaseOrderProducts.status) return purchaseOrderProducts;
      let data = purchaseOrderProducts.response;
      for (let i = 0; i < data.length; i++) {
        // get unit
        const { response: unit } =
          await ProductUnitsRepository.getOneRepository({
            product_detail_id: data[i].product_detail_id,
            unit_code: data[i].unit_code,
          });

        // create ON_HOLD
        await ProductStockDistributionsRepository.InsertProductDistributionRepository(
          {
            product_id: data[i].product_id,
            product_detail_id: data[i].product_detail_id,
            product_unit_id: unit.id,
            transactions_id: data[i].purchase_order_client_id,
            transaction_code: "PRODUCT_SALES",
            source_table: "purchase_order_client_id",
            status_distribution_code: "ON_HOLD",
            quantity: -data[i].quantity,
            created_by: params.id,
          }
        );
      }
      const { response } =
        await PurchaseOrderClientsRepository.getDetailOneRepository({
          purchase_order_client_id,
        });

      // update status on purchase order clients
      await PurchaseOrderClientsRepository.updateRepository(
        {
          progress_type_code: "HAS_NOT_SENT",
        },
        { id: purchase_order_client_id }
      );

      // send blast to driver
      await BlastTravelDocumentDriverTemplate({
        phone: travelDocumentDelivery.response.phone,
        name: travelDocumentDelivery.response.driver_name,
        client_name: response.name,
        client_phone: response.phone,
        travel_code: travelDocumentDelivery.response.travel_code,
        location: `${response.lat}` + "," + `${response.long}`,
      });
      // update travelDocumentClient
      await PurchaseOrderTravelDocumentClientsRepository.updateRepository(
        { distribution_status: true },
        {
          purchase_order_client_id: purchase_order_client_id,
        }
      );
      return {
        status: true,
        response: null,
        messages: "Successfully Validation Out Products",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async PurchaseOrderInsertDistributionDelivery(params) {
    try {
      const {
        items,
        transaction_code,
        purchase_order_vendor_delivery_id,
        purchase_order_vendor_id,
        status_distribution_code,
        source_table,
        created_by,
      } = params;
      for (let i = 0; i < items.length; i++) {
        if (items[i].quantity > 0) {
          // products distribution stock
          await ProductStockDistributionsRepository.InsertProductDistributionRepository(
            {
              transactions_id: purchase_order_vendor_delivery_id,
              product_id: items[i].product_id,
              product_detail_id: items[i].product_detail_id,
              product_unit_id: items[i].product_unit_id,
              transaction_code: transaction_code,
              status_distribution_code: status_distribution_code,
              source_table: source_table,
              quantity: items[i].quantity,
              created_by: created_by,
            }
          );
        }
      }
      const quantityReceived =
        await PurchaseOrderVendorsDeliveryRepository.isMatchReceivedQuantityRepository(
          {
            purchase_order_vendor_id: purchase_order_vendor_id,
          }
        );
      if (!quantityReceived.status) return quantityReceived;
      let { is_received } = quantityReceived.response;
      if (is_received)
        await PurchaseOrderVendorsRepository.updateRepository(
          { progress_type_code: "ORDER_RECEIVED_WAREHOUSE" },
          {
            id: purchase_order_vendor_id,
          }
        );
      if (!is_received)
        await PurchaseOrderVendorsRepository.updateRepository(
          { progress_type_code: "WAREHOUSE_LOADING" },
          {
            id: purchase_order_vendor_id,
          }
        );
      return {
        status: true,
        response: null,
        messages: "Successfully update stock",
      };
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async totalProductsHelper(params) {
    try {
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
}

module.exports = new ProductsHelper();
