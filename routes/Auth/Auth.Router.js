const express = require("express");

const router = express.Router();
const { AuthController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

// manage
router.get("/accounts", AuthController.getAccountsController);
router.get("/account-detail", AuthController.getAccountDetailController);
router.post("/account", JWTVerify, AuthController.createController);
router.patch("/account", JWTVerify, AuthController.updateAccountController);
router.delete("/account", JWTVerify, AuthController.deleteAccountController);

// booster
router.get("/accounts/booster", AuthController.getAccountsBoosterController);

// auth
router.post("/login", AuthController.loginController);
router.post("/logout", JWTVerify, AuthController.logoutController);
router.get("/session", JWTVerify, AuthController.sesionController);

// responsibilities
router.get("/responsibilities", AuthController.responsibilitiesController);

// recovery password
router.post("/recovery", JWTVerify, AuthController.recoveryPasswordController);
module.exports = router;
