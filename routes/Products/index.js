const express = require("express");

const router = express.Router();

router.use("/", require("./Products.Router"));

module.exports = router;
