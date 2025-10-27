const { getAddressFromCoordinates } = require("../../api/OpenStreetMap");
const {
  PurchaseOrderClientsRepository,
  PurchaseOrderProductClientsRepository,
  ClientsRepository,
  ProductStockDistributionsRepository,
  PurchaseOrderTravelDocumentClientsRepository,
  AdminResponsibilitiesRepository,
  PurchaseOrderClientsDeliveryRepository,
  AdminsRepository,
  FinanceRepository,
} = require("../../repository");
const {
  Uuid: { uuids },
  Upload: { UploadFile },
} = require("../../utils");
const {
  WhatsAppTemplate: { BlastTravelDocumentWarehouseTemplate },
} = require("../../template");
const { ProductsHelper } = require("../Products");
const FinanceHelper = require("../Finance/Finance.Helper");

class PurchaseOrderClientsHelper {
  async insertPurchaseOrder(params) {
    try {
      const {
        items,
        client_id,
        progress_percentage,
        input_date,
        due_date,
        payment_method_code,
        id,
        send_date,
      } = params;

      const POID = uuids();

      // === Process each product item and calculate totals ===
      const productResults = [];

      for (const item of items) {
        const product = await ProductsHelper.insertProductPurchaseOrder({
          product_id: item.product_id,
          product_detail_id: item.product_detail_id,
          name: item.name,
          unit_code: item.unit_code,
          description: item.description,
          id: id,
        });

        if (!product.status) return product;

        const subtotal = item.price * item.quantity;

        // Calculate discount (if any)
        const discount_percentage = parseFloat(item.discount_percentage || 0);
        const discount_amount = item.discount_amount;

        // Calculate VAT (PPN) if applicable
        const ppn_percentage = item.is_ppn ? 11 : 0;
        const ppn_amount =
          (subtotal - discount_amount) * (ppn_percentage / 100);

        // Final total after discount and VAT
        const final_total = subtotal - discount_amount + ppn_amount;

        productResults.push({
          purchase_order_client_id: POID,
          product_id: product.response.product_id,
          product_detail_id: product.response.product_detail_id,
          product_unit_id: product.response.product_unit_id,
          quantity: item.quantity,
          price: item.price,
          unit_code: item.unit_code,
          discount_percentage,
          discount_amount,
          ppn_percentage,
          ppn_amount,
          total: subtotal,
          final_total,
        });
      }

      // === Calculate summary totals ===
      const total = productResults.reduce((sum, p) => sum + p.total, 0);
      const discount_flag = productResults.reduce(
        (sum, p) => sum + p.discount_amount,
        0
      );
      const final_total = productResults.reduce(
        (sum, p) => sum + p.final_total,
        0
      );

      // === Generate new purchase order code ===
      const newCode =
        await PurchaseOrderClientsRepository.getCodePORepository();
      // === Create purchase order record ===
      await PurchaseOrderClientsRepository.createRepository({
        id: POID,
        client_id,
        purchase_order_client_code: newCode.response.new_code,
        total,
        final_total,
        progress_type_code: "FOLLOW_UP",
        progress_percentage,
        input_date,
        discount_flag: discount_flag ? "Y" : "N",
        due_date,
        send_date,
        created_by: id,
        status_trx_code: "PENDING",
        payment_method_code,
      });

      // === Insert product details for this purchase order ===
      await PurchaseOrderProductClientsRepository.createRepository(
        productResults
      );

      const client = await ClientsRepository.getOneRepository({
        id: client_id,
      });
      if (!client.status) return client;
      const { name } = client.response;
      // finance create
      await FinanceHelper.createFinanceHelper({
        finance_code: "INCOME",
        input_date,
        description: `Penjualan Produk ke ${name}`,
        category_code: "PO_CLIENT",
        source_id: POID,
        source_table: "purchase_order_clients",
        total: final_total,
        status_code: "PENDING",
        path: null,
        id,
      });
      return this.success(null, "Successfully created PO Client");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async updatePurchaseOrder(params) {
    try {
      const {
        items,
        client_id,
        progress_percentage,
        input_date,
        due_date,
        payment_method_code,
        id,
        send_date,
      } = params;

      const POID = params.purchase_order_client_id;

      // === Check if PO exists ===
      const purchaseOrder =
        await PurchaseOrderClientsRepository.getOneRepository({
          id: POID,
        });
      if (!purchaseOrder.status)
        return this.fail(null, "Purchase Order not found");

      // === Delete old product details ===
      const deleted =
        await PurchaseOrderProductClientsRepository.deleteRepository({
          purchase_order_client_id: POID,
        });
      if (!deleted.status) return deleted;

      // === Process each product item and calculate totals ===
      const productResults = [];

      for (const item of items) {
        const product = await ProductsHelper.insertProductPurchaseOrder({
          product_id: item.product_id,
          product_detail_id: item.product_detail_id,
          name: item.name,
          unit_code: item.unit_code,
          description: item.description,
          id: id,
        });

        const subtotal = item.price * item.quantity;

        // Calculate discount (if any)
        const discount_percentage = parseFloat(item.discount_percentage) || 0;
        const discount_amount = item.discount_amount
          ? Number(item.discount_amount)
          : (subtotal * discount_percentage) / 100;

        // Calculate VAT (PPN) if applicable
        const ppn_percentage = item.is_ppn ? 11 : 0;
        const ppn_amount =
          (subtotal - discount_amount) * (ppn_percentage / 100);

        // Final total after discount and VAT
        const final_total = subtotal - discount_amount + ppn_amount;

        productResults.push({
          purchase_order_client_id: POID,
          product_id: product.response.product_id,
          product_detail_id: product.response.product_detail_id,
          product_unit_id: product.response.product_unit_id,
          quantity: item.quantity,
          price: item.price,
          unit_code: item.unit_code,
          discount_percentage,
          discount_amount,
          ppn_percentage,
          ppn_amount,
          total: subtotal,
          final_total,
        });
      }

      // === Calculate summary totals ===
      const total = productResults.reduce((sum, p) => sum + p.total, 0);
      const discount_flag = productResults.reduce(
        (sum, p) => sum + p.discount_amount,
        0
      );
      const final_total = productResults.reduce(
        (sum, p) => sum + p.final_total,
        0
      );

      // === Update Purchase Order record ===
      await PurchaseOrderClientsRepository.updateRepository(
        {
          client_id,
          total,
          final_total,
          progress_type_code: params.progress_type_code,
          progress_percentage,
          input_date,
          discount_flag: discount_flag ? "Y" : "N",
          due_date,
          send_date,
          updated_by: id,
          status_trx_code: params.status_trx_code,
          payment_method_code,
        },
        { id: POID }
      );

      // === Recreate product details ===
      await PurchaseOrderProductClientsRepository.createRepository(
        productResults
      );
      const client = await ClientsRepository.getOneRepository({
        id: client_id,
      });
      if (!client.status) return client;
      const { name } = client.response;
      // finance update
      await FinanceHelper.updateFinanceHelper(
        {
          finance_code: "INCOME",
          input_date: input_date,
          description: `Penjualan Produk ke ${name}`,
          category_code: "PO_CLIENT",
          total: final_total,
          status_code: params.status_trx_code,
          path: null,
          id,
        },
        { source_id: POID }
      );
      return this.success(null, "Successfully updated PO Client");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }
  async GetAddresClientDetailByCoordinate(params) {
    try {
      const client = await ClientsRepository.getOneRepository({
        id: params.client_id,
      });
      if (!client.status) return client;
      const { lat, long, name } = client.response;

      const address = await getAddressFromCoordinates(lat, long);
      const recipient = {
        name: name,
        address: address.response,
      };
      return {
        status: true,
        response: recipient,
        messages: "Succesfully Get Credential Client",
      };
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async GetCheckingStockByPurchaseOderClientID(params) {
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
      let isStock = true;
      let isDemand = [];

      for (const {
        product_detail_id,
        quantity,
        product_name,
        description,
        unit_code,
      } of products.response) {
        const distribution =
          await ProductStockDistributionsRepository.CheckStockByProductDetailID(
            {
              product_detail_id,
              quantity,
              unit_code,
            }
          );
        if (!distribution.status) {
          const { response: stock } =
            await ProductStockDistributionsRepository.GetOneProductDistributionRepository(
              { product_detail_id, unit_code }
            );
          isStock = false;

          isDemand.push({
            product_detail_id,
            name: product_name + " " + description,
            product_unit_id: stock.product_unit_id,
            quantity,
            unit_code,
            exist: stock.total_quantity,
          });
        }
      }
      if (!isStock)
        return {
          status: false,
          response: isDemand,
          messages: "This product is out of stock",
        };
      return {
        status: true,
        response: null,
        messages: "Purchase Order Valid in Quantity",
      };
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async TravelDocumentClientsChecking(params) {
    try {
      // Travel Document Client
      let travelDocument =
        await PurchaseOrderClientsDeliveryRepository.getOneDetailDeliveryRepository(
          {
            purchase_order_client_id: params.purchase_order_client_id,
          }
        );
      if (!travelDocument.status) {
        const { response } =
          await PurchaseOrderTravelDocumentClientsRepository.getCodeRepository();

        const { response: warehouse } =
          await AdminResponsibilitiesRepository.getAllByCodeReponsibilityRepository(
            { code: "WAREHOUSE" }
          );

        for (let i = 0; i < warehouse.length; i++) {
          await BlastTravelDocumentWarehouseTemplate({
            travel_code: response.new_code,
            phone: params.phone,
            name: warehouse[i].name,
            purchase_order_client_code: params.purchase_order_client_code,
          });
        }
        const admin = await AdminsRepository.getOneRepository({
          id: params.driver_id,
          deleted_at: null,
        });

        // create delivery
        await PurchaseOrderClientsDeliveryRepository.createRepository({
          purchase_order_client_id: params.purchase_order_client_id,
          travel_code: response.new_code,
          driver_id: params.driver_id,
          created_by: params.id,
        });
        // create document travel
        const documents =
          await PurchaseOrderTravelDocumentClientsRepository.createRepository({
            purchase_order_client_id: params.purchase_order_client_id,
            travel_code: response.new_code,
          });

        documents.response.driver_name = admin.response.name;
        return documents;
      }
      const admin = await AdminsRepository.getOneRepository({
        id: params.driver_id,
        deleted_at: null,
      });

      // create delivery
      await PurchaseOrderClientsDeliveryRepository.updateRepository(
        {
          driver_id: params.driver_id,
          updated_at: new Date(),
          updated_by: params.id,
        },
        { purchase_order_client_id: params.purchase_order_client_id }
      );
      travelDocument.response.driver_name = admin.response.name;
      return travelDocument;
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async TravelDetailOutClient(params) {
    try {
      return await PurchaseOrderClientsDeliveryRepository.getOneDetailDeliveryRepository(
        params
      );
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }

  async TravelDetailOutClient(params) {
    try {
      return await PurchaseOrderClientsDeliveryRepository.getOneDetailDeliveryRepository(
        params
      );
    } catch (e) {
      return { status: false, response: e, messages: e.message };
    }
  }
  async updateDeliveryStatusDone(params) {
    try {
      const typeImages = params.path
        .split(";")[0]
        .match(/jpeg|png|gif|jpg|webp/)[0];
      const bodyImages = Buffer.from(
        params.path.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      let Id = uuids();
      const options = {
        Bucket: process.env.AWSBUCKET,
        Key: "proof_delivery_client_po/" + Id + "." + typeImages,
        Body: bodyImages,
        ContentEncoding: "base64",
        ContentType: "image/" + typeImages,
        ACL: "public-read",
      };
      const paths = await UploadFile(options);

      // update
      await PurchaseOrderClientsDeliveryRepository.updateRepository(
        {
          updated_at: new Date(),
          updated_by: params.id,
          path: paths.response,
        },
        { purchase_order_client_id: params.purchase_order_client_id }
      );
      // realisasi
      const purchaseOrderProducts =
        await PurchaseOrderProductClientsRepository.getOneDetailRepository({
          purchase_order_client_id: params.purchase_order_client_id,
        });
      if (!purchaseOrderProducts.status) return purchaseOrderProducts;
      let data = purchaseOrderProducts.response;
      for (let i = 0; i < data.length; i++) {
        // create REALIZATION
        await ProductStockDistributionsRepository.UpdateProductDistributionRepository(
          {
            status_distribution_code: "REALIZATION",
            updated_at: new Date(),
            updated_by: params.id,
          },
          { transactions_id: params.purchase_order_client_id }
        );
      }
    } catch (e) {
      console.log(e);
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

module.exports = new PurchaseOrderClientsHelper();
