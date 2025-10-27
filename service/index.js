const { AuthService } = require("./Auth");
const {
  PurchaseOrderClientService,
  PurchaseOrderVendorsService,
} = require("./PurchaseOrder");
const { ProductsService } = require("./Products");
const { ClientsService } = require("./Clients");
const { VendorsService } = require("./Vendors");
const { ParameterService } = require("./Parameter");
const { FinanceService } = require("./Finance");

module.exports = {
  AuthService,
  PurchaseOrderClientService,
  PurchaseOrderVendorsService,
  ProductsService,
  ClientsService,
  VendorsService,
  ParameterService,
  FinanceService,
};
