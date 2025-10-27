const express = require("express");

const router = express.Router();

router.use("/", require("./Clients.Router"));

module.exports = router;
