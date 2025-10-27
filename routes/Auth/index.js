const express = require("express");

const router = express.Router();

router.use("/", require("./Auth.Router"));

module.exports = router;
