const { FinanceService } = require("../../service");
const {
  OutParser: { OutFailed, OutSuccess },
} = require("../../utils");
const { FinanceValidation } = require("./Validation");

class FinanceController {
  async createFinanceController(req, res) {
    try {
      const validate = await FinanceValidation.createFinanceValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await FinanceService.createService({
        ...req.body,
        ...req.user,
      });
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getFinanceController(req, res) {
    try {
      const validate = await FinanceValidation.getFinanceValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await FinanceService.getService(req.query);
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getGlobalAnalyticFinanceController(req, res) {
    try {
      const validate = await FinanceValidation.getDashboard(req.query);
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await FinanceService.getAnalyticService({
        ...req.query,
        ...req.user,
      });
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async updateFinanceController(req, res) {
    try {
      const validate = await FinanceValidation.updateFinanceValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await FinanceService.updateService({
        ...req.body,
        ...req.user,
      });
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async deleteFinanceController(req, res) {
    try {
      const validate = await FinanceValidation.getDetailFinanceValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await FinanceService.deleteService({
        ...req.query,
        ...req.user,
      });
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
}

module.exports = new FinanceController();
