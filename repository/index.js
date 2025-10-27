const {
  AdminsRepository,
  AdminResponsibilitiesRepository,
  ResponsibilitiesRepository,
} = require("./Admins");
const {
  PurchaseOrderClientsRepository,
  PurchaseOrderVendorsRepository,
  PurchaseOrderProductVendorsRepository,
  PurchaseOrderProductClientsRepository,
  PurchaseOrderTravelDocumentClientsRepository,
  PurchaseOrderClientsDeliveryRepository,
  PurchaseOrderVendorsDeliveryRepository,
} = require("./PurchaseOrder");
const {
  ProductDetailsRepository,
  ProductsRepository,
  ProductStockDistributionsRepository,
  ProductUnitsRepository,
  ProductFollowUpRepository,
} = require("./Products");
const { ClientsRepository } = require("./Clients");
const { VendorsRepository } = require("./Vendors");
const { ParameterRepository } = require("./Parameter");
const { FinanceRepository } = require("./Finance");
const { GlobalAnalyticRepository } = require("./GlobalAnalytic");

module.exports = {
  AdminsRepository,
  AdminResponsibilitiesRepository,
  ResponsibilitiesRepository,
  PurchaseOrderClientsRepository,
  PurchaseOrderVendorsRepository,
  PurchaseOrderProductVendorsRepository,
  ProductDetailsRepository,
  ProductsRepository,
  ProductStockDistributionsRepository,
  ProductUnitsRepository,
  ProductFollowUpRepository,
  PurchaseOrderProductClientsRepository,
  PurchaseOrderTravelDocumentClientsRepository,
  PurchaseOrderClientsDeliveryRepository,
  PurchaseOrderVendorsDeliveryRepository,
  ClientsRepository,
  VendorsRepository,
  ParameterRepository,
  FinanceRepository,
  GlobalAnalyticRepository,
};
