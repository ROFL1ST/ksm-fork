const express = require("express");

const router = express.Router();
const { ProductsController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

// products manage
router.get("/", ProductsController.getProductsController);
router.get("/detail", JWTVerify, ProductsController.getProductDetailController);
router.get(
  "/restock",
  JWTVerify,
  ProductsController.getProductRestockController
);
router.post("/", JWTVerify, ProductsController.createProductsController);
router.patch("/", JWTVerify, ProductsController.updateProductsController);
router.delete("/", JWTVerify, ProductsController.deleteProductsController);

router.get(
  "/distributions",
  ProductsController.GetProductsDistributionController
);
router.post(
  "/distribution",
  JWTVerify,
  ProductsController.DistributionProductsController
);
router.post(
  "/request",
  JWTVerify,
  ProductsController.DistributionProductsRequestStocksController
);
router.get("/details", ProductsController.getProductDetailsController);
router.get(
  "/follow-up/detail",
  ProductsController.getProductFollowUpDetailController
);
router.get("/follow-up", ProductsController.getProductFollowUpController);

module.exports = router;
