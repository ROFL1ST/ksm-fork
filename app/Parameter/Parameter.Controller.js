const {
  OutParser: { OutSuccess, OutFailed },
} = require("../../utils");
const { parameterValidation } = require("./Validation");
const { ParameterService } = require("../../service");

class ParameterController {
  async listParameterLookupValueController(req, res) {
    try {
      const validate = parameterValidation.lisParameterValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ParameterService.listParameterService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async getOneParameterLookupValueController(req, res) {
    try {
      const validate = parameterValidation.getOneParameterValueValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ParameterService.getOneParameterValueService(
        req.query
      );
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async craeteParameterLookupValueController(req, res) {
    try {
      const validate = parameterValidation.createParameterValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ParameterService.createParameterValueService({
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
  async updateParameterLookupValueController(req, res) {
    try {
      const validate = parameterValidation.updateParameterValueValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ParameterService.updateParameterValueService({
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
  async deleteParameterLookupValueController(req, res) {
    try {
      const validate = parameterValidation.paramLookupValueByIDValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ParameterService.deleteParameterLookupValueService(
        req.query
      );
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async listParameterLookupController(req, res) {
    try {
      const response = await ParameterService.parameterLookupService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
}

module.exports = new ParameterController();
