const express = require("express");

const router = express.Router();

router.use("/", require("./Vendors.Router"));

module.exports = router;
