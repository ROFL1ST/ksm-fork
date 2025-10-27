const express = require("express");

const router = express.Router();
const { ClientsController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

router.post("/", JWTVerify, ClientsController.createClientsController);
router.patch("/", JWTVerify, ClientsController.updateClientsController);
router.delete("/", JWTVerify, ClientsController.deleteClientsController);
router.get("/list", JWTVerify, ClientsController.deleteClientsController);
router.get("/", ClientsController.getClientsController);

module.exports = router;
