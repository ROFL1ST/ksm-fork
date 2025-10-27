const express = require("express");

const router = express.Router();
const auth = require("./Auth");
const purchaseOrder = require("./PurchaseOrder");
const products = require("./Products");
const clients = require("./Clients");
const vendors = require("./Vendors");
const parameter = require("./Parameter");
const finance = require("./Finance");

router.use("/auth", auth);
router.use("/purchase-order", purchaseOrder);
router.use("/products", products);
router.use("/clients", clients);
router.use("/vendors", vendors);
router.use("/parameter", parameter);
router.use("/finance", finance);

module.exports = router;
