const express = require("express");

const router = express.Router();

const { ParameterController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

// lookup-values
router.get(
  "/lookup-values",
  ParameterController.listParameterLookupValueController
);
router.get(
  "/lookup-values-one",
  ParameterController.getOneParameterLookupValueController
);
router.post(
  "/lookup-values",
  JWTVerify,
  ParameterController.craeteParameterLookupValueController
);
router.patch(
  "/lookup-values",
  JWTVerify,
  ParameterController.updateParameterLookupValueController
);
router.delete(
  "/lookup-values",
  JWTVerify,
  ParameterController.deleteParameterLookupValueController
);

// lookups
router.get("/lookups", ParameterController.listParameterLookupController);

module.exports = router;
