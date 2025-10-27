const express = require("express");

const router = express.Router();

router.use("/", require("./Parameter.Router"));

module.exports = router;
