const { ClientsService } = require("../../service");
const {
  OutParser: { OutFailed, OutSuccess },
} = require("../../utils");
const { ClientsValidation } = require("./validation");

class ClientsController {
  async createClientsController(req, res) {
    try {
      const validate = await ClientsValidation.createProductValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ClientsService.createClientService({
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
  async updateClientsController(req, res) {
    try {
      const validate = await ClientsValidation.updateProductValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ClientsService.updateClientService({
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
  async deleteClientsController(req, res) {
    try {
      const validate = await ClientsValidation.detailProductValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ClientsService.deleteClientService({
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
  async getClientsController(req, res) {
    try {
      const response = await ClientsService.getProductService();
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getClientsController(req, res) {
    try {
      const response = await ClientsService.getProductService();
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
}

module.exports = new ClientsController();
