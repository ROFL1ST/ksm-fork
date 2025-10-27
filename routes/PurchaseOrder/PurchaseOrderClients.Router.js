const express = require("express");

const router = express.Router();
const { PurchaseOrderClientController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

router.post(
  "/",
  JWTVerify,
  PurchaseOrderClientController.PostPurchaseOrderClientController
);
router.patch(
  "/",
  JWTVerify,
  PurchaseOrderClientController.UpdatePurchaseOrderClientController
);
router.delete(
  "/",
  JWTVerify,
  PurchaseOrderClientController.DeletePurchaseOrderClientController
);
router.get(
  "/sales",
  JWTVerify,
  PurchaseOrderClientController.GetPurchaseOrderClientSalesController
);
router.get(
  "/detail",
  JWTVerify,
  PurchaseOrderClientController.GetOnePurchaseOrderClientSalesController
);
router.get("/", PurchaseOrderClientController.GetPurchaseOrderClientController);

// travel document
router.get(
  "/travel-document",
  JWTVerify,
  PurchaseOrderClientController.TravelDocumentPurchaseOrderClientController
);
router.post(
  "/description/travel-document",
  PurchaseOrderClientController.ManagePurchaseOrderTravelDocumentDescriptionController
);
router.get(
  "/description/travel-document",
  PurchaseOrderClientController.GetPurchaseOrderTravelDocumentDescriptionController
);
router.get(
  "/assets",
  PurchaseOrderClientController.GetAssetsPurchaseOrderClientController
);

// driver
router.get(
  "/delivery-histories",
  JWTVerify,
  PurchaseOrderClientController.GetPurchaseOrderDeliveryHistoriesController
);
router.get(
  "/delivery-history/detail",
  JWTVerify,
  PurchaseOrderClientController.GetPurchaseOrderDeliveryHistoryDetailController
);
router.patch(
  "/delivery-history/detail",
  JWTVerify,
  PurchaseOrderClientController.UpdatePurchaseOrderDeliveryHistoryDetailController
);

module.exports = router;
