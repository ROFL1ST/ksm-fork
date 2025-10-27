const { AuthController } = require("./Auth");
const {
  PurchaseOrderClientController,
  PurchaseOrderVendorsController,
} = require("./PurchaseOrder");
const { ProductsController } = require("./Products");
const { ClientsController } = require("./Clients");
const { VendorsController } = require("./Vendors");
const { ParameterController } = require("./Parameter");
const { FinanceController } = require("./Finance");

module.exports = {
  AuthController,
  PurchaseOrderClientController,
  PurchaseOrderVendorsController,
  ProductsController,
  ClientsController,
  VendorsController,
  ParameterController,
  FinanceController,
};
