const express = require("express");

const router = express.Router();
const { PurchaseOrderVendorsController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

router.post(
  "/",
  JWTVerify,
  PurchaseOrderVendorsController.PostPurchaseOrderVendorsController
);
router.patch(
  "/",
  JWTVerify,
  PurchaseOrderVendorsController.UpdatePurchaseOrderVendorsController
);
router.delete(
  "/",
  JWTVerify,
  PurchaseOrderVendorsController.DeletePurchaseOrderVendorsController
);
router.get(
  "/",
  JWTVerify,
  PurchaseOrderVendorsController.GetPurchaseOrderVendorsController
);
router.get(
  "/detail",
  JWTVerify,
  PurchaseOrderVendorsController.GetOnePurchaseOrderVendorsSalesController
);

// travel document
router.get(
  "/travel-document",
  JWTVerify,
  PurchaseOrderVendorsController.TravelDocumentPurchaseOrderVendorsController
);
router.post(
  "/description/travel-document",
  PurchaseOrderVendorsController.ManagePurchaseOrderTravelDocumentDescriptionController
);
router.get(
  "/description/travel-document",
  PurchaseOrderVendorsController.GetPurchaseOrderTravelDocumentDescriptionController
);
router.get(
  "/assets",
  PurchaseOrderVendorsController.GetAssetsPurchaseOrderVendorsController
);

// products In
router.post(
  "/delivery/received", /// rubah nanti di fe
  JWTVerify,
  PurchaseOrderVendorsController.CreatePurchaseOrderProductsDeliveryController
);
router.get(
  "/delivery/received",
  PurchaseOrderVendorsController.PurchaseOrderDeliveryReceivedController
);
router.delete(
  "/delivery/received",
  JWTVerify,
  PurchaseOrderVendorsController.PurchaseOrderDeleteDeliveryReceivedController
);
router.patch(
  "/delivery/received",
  JWTVerify,
  PurchaseOrderVendorsController.PurchaseOrderUpdateDeliveryReceivedController
);
router.get(
  "/received/delivery/export",
  JWTVerify,
  PurchaseOrderVendorsController.PurchaseOrderExportDeliveryReceivedController
);

// list delivery received
router.get(
  "/receiveds/delivery",
  PurchaseOrderVendorsController.PurchaseOrderProductsDeliveryController
);

module.exports = router;
