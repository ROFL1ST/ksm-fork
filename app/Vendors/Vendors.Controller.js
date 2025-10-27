const { VendorsService } = require("../../service");
const {
  OutParser: { OutFailed, OutSuccess },
} = require("../../utils");
const { VendorsValidation } = require("./validation");

class VendorsController {
  async createVendorsController(req, res) {
    try {
      const validate = await VendorsValidation.createVendorValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await VendorsService.createVendorService({
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
  async getVendorsController(req, res) {
    try {
      const response = await VendorsService.getProductService();
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
}

module.exports = new VendorsController();
