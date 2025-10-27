const express = require("express");

const router = express.Router();

router.use("/clients", require("./PurchaseOrderClients.Router"));
router.use("/vendors", require("./PurchaseOrderVendors.Router"));

module.exports = router;
