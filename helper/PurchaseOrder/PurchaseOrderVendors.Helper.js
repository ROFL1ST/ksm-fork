const { getAddressFromCoordinates } = require("../../api/OpenStreetMap");
const {
  PurchaseOrderVendorsRepository,
  PurchaseOrderProductVendorsRepository,
  ClientsRepository,
  ProductStockDistributionsRepository,
  PurchaseOrderTravelDocumentClientsRepository,
  AdminResponsibilitiesRepository,
  ProductFollowUpRepository,
  VendorsRepository,
} = require("../../repository");
const {
  Uuid: { uuids },
} = require("../../utils");
const {
  WhatsAppTemplate: { BlastTravelDocumentWarehouseTemplate },
} = require("../../template");
const { ProductsHelper } = require("../Products");
const FinanceHelper = require("../Finance/Finance.Helper");

class PurchaseOrderVendorsHelper {
  async insertPurchaseOrder(params) {
    try {
      const {
        items,
        vendor_id,
        progress_percentage,
        input_date,
        due_date,
        payment_method_code,
        id,
        send_date,
      } = params;

      const POID = uuids();

      // === Process each product item and calculate totals ===
      const productResults = await Promise.all(
        items.map(async (item) => {
          const product = await ProductsHelper.insertProductPurchaseOrder({
            product_id: item.product_id,
            product_detail_id: item.product_detail_id,
            name: item.name,
            unit_code: item.unit_code,
            description: item.description,
            id: id,
          });
          // productFollowUp
          const productFollowUp =
            await ProductFollowUpRepository.getOneViewRepository({
              product_detail_id: product.response.product_detail_id,
              unit_code: item.unit_code,
              status_code: "FOLLOW_UP_STOCK",
            });

          if (productFollowUp.status) {
            let { quantity: demand_quantity, total_quantity: on_hand } =
              productFollowUp.response;
            if (item.quantity + on_hand < demand_quantity) {
              return {
                status: false,
                response: null,
                messages: "STOCK_DEMAND_NOT_MATCH",
              };
            }
            await ProductFollowUpRepository.updateRepository(
              { status_code: "IN_PROGRESS_ORDER" },
              {
                product_detail_id: product.response.product_detail_id,
                product_unit_id: productFollowUp.response.product_unit_id,
              }
            );
          }

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

          return {
            purchase_order_vendor_id: POID,
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
          };
        })
      );
      if (productResults[0].status === false) return productResults[0];

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
        await PurchaseOrderVendorsRepository.getCodePORepository();
      // === Create purchase order record ===
      await PurchaseOrderVendorsRepository.createRepository({
        id: POID,
        vendor_id,
        purchase_order_vendor_code: newCode.response.new_code,
        total,
        final_total,
        progress_type_code: "IN_PROGRESS_ORDER",
        progress_percentage,
        input_date,
        discount_flag: discount_flag ? "Y" : "N",
        due_date,
        send_date,
        created_by: id,
        status_trx_code: params.status_trx_code,
        payment_method_code,
      });

      // === Insert product details for this purchase order ===
      await PurchaseOrderProductVendorsRepository.createRepository(
        productResults
      );
      // finance create
      const vendor = await VendorsRepository.getOneRepository({
        id: vendor_id,
      });
      if (!vendor.status) return vendor;
      const { name } = vendor.response;
      await FinanceHelper.createFinanceHelper({
        finance_code: "EXPENSE",
        input_date,
        description: `Pembelian Produk ke ${name}`,
        category_code: "PO_VENDOR",
        source_id: POID,
        source_table: "purchase_order_vendors",
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
        vendor_id,
        progress_percentage,
        input_date,
        due_date,
        payment_method_code,
        id,
        send_date,
      } = params;

      const POID = params.purchase_order_vendor_id;

      // === Check if PO exists ===
      const purchaseOrder =
        await PurchaseOrderVendorsRepository.getOneRepository({
          id: POID,
        });
      if (!purchaseOrder.status)
        return this.fail(null, "Purchase Order not found");

      // === Delete old product details ===
      const deleted =
        await PurchaseOrderProductVendorsRepository.deleteRepository({
          purchase_order_vendor_id: POID,
        });
      if (!deleted.status) return deleted;

      // === Process each product item and calculate totals ===
      const productResults = await Promise.all(
        items.map(async (item) => {
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

          return {
            purchase_order_vendor_id: POID,
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
          };
        })
      );

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
      await PurchaseOrderVendorsRepository.updateRepository(
        {
          vendor_id,
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
      await PurchaseOrderProductVendorsRepository.createRepository(
        productResults
      );
      const vendor = await VendorsRepository.getOneRepository({
        id: vendor_id,
      });
      if (!vendor.status) return vendor;
      const { name } = vendor.response;
      // finance create
      await FinanceHelper.updateFinanceHelper(
        {
          finance_code: "EXPENSE",
          input_date,
          description: `Pembelian Produk ke ${name}`,
          category_code: "PO_VENDOR",
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
      const vendor = await VendorsRepository.getOneRepository({
        id: params.vendor_id,
      });
      if (!vendor.status) return vendor;
      const { lat, long, name } = vendor.response;

      const address = await getAddressFromCoordinates(lat, long);
      const recipient = {
        name: name,
        address: address.response,
      };
      return {
        status: true,
        response: recipient,
        messages: "Succesfully Get Credential vendor",
      };
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async GetCheckingStockByPurchaseOderClientID(params) {
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
        if (!distribution.status)
          return {
            status: false,
            response: product_name + " " + description,
            messages: distribution.messages,
          };
      }
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
        await PurchaseOrderTravelDocumentClientsRepository.getOneRepository({
          purchase_order_vendor_id: params.purchase_order_vendor_id,
        });

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
        return await PurchaseOrderTravelDocumentClientsRepository.createRepository(
          {
            purchase_order_vendor_id: params.purchase_order_vendor_id,
            travel_code: response.new_code,
          }
        );
      }
      return travelDocument;
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

module.exports = new PurchaseOrderVendorsHelper();
