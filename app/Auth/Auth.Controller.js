const {
  OutParser: { OutSuccess, OutFailed },
  Cookies: { setAuthCookies, clearAuthCookies },
} = require("../../utils");
const { AuthValidation } = require("./Validation");
const { AuthService } = require("../../service");
class AuthController {
  async loginController(req, res) {
    try {
      const validate = AuthValidation.loginValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.loginService(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      const { accessToken, refreshToken } = response.response;

      setAuthCookies(res, accessToken, refreshToken);

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }

  async createController(req, res) {
    try {
      const validate = AuthValidation.registerValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.registerService({
        ...req.body,
        ...req.user,
      });
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async getAccountsController(req, res) {
    try {
      const validate = AuthValidation.getAccountsValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.getAccountsService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async getAccountsBoosterController(req, res) {
    try {
      const validate = AuthValidation.getAccountsBoosterValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.getAccountsBoosterService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async getAccountDetailController(req, res) {
    try {
      const validate = AuthValidation.DetailValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.getAccountDetailService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async updateAccountController(req, res) {
    try {
      const validate = AuthValidation.updateValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.updateAccountService({
        ...req.body,
        ...req.user,
      });
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async deleteAccountController(req, res) {
    try {
      const validate = AuthValidation.DetailValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.deleteAccountService({
        ...req.query,
        ...req.user,
      });
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async responsibilitiesController(req, res) {
    try {
      const response = await AuthService.responsibilitiesService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async recoveryPasswordController(req, res) {
    try {
      const validate = AuthValidation.RecoveryPasswordValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.recoveryPasswordService({
        ...req.body,
        ...req.user,
      });
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async logoutController(req, res) {
    try {
      clearAuthCookies(res);
      return res.send(OutSuccess(null, "Logout Success"));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async sesionController(req, res) {
    try {
      const response = await AuthService.getResponsibilities(req.user);
      if (!req.user) return res.send(OutFailed(null, "Session Expired"));
      return res.send(OutSuccess(response.response, "Session Active"));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
}

module.exports = new AuthController();
