const express = require("express");

const router = express.Router();
const { FinanceController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

router.post("/", JWTVerify, FinanceController.createFinanceController);
router.get("/", FinanceController.getFinanceController);
router.patch("/", JWTVerify, FinanceController.updateFinanceController);
router.delete("/", JWTVerify, FinanceController.deleteFinanceController);

router.get(
  "/global-analynic",
  JWTVerify,
  FinanceController.getGlobalAnalyticFinanceController
);

module.exports = router;
