const express = require("express");

const router = express.Router();
const { VendorsController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

router.post("/", JWTVerify, VendorsController.createVendorsController);
router.get("/", VendorsController.getVendorsController);

module.exports = router;
