const { ProductsService } = require("../../service");
const {
  OutParser: { OutFailed, OutSuccess },
} = require("../../utils");
const { ProductsValidation } = require("./validation");

class ProductsController {
  async createProductsController(req, res) {
    try {
      const validate = await ProductsValidation.createProductValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.createProductService({
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
  async updateProductsController(req, res) {
    try {
      const validate = await ProductsValidation.updateProductValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.updateProductService({
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
  async deleteProductsController(req, res) {
    try {
      const validate = await ProductsValidation.ProductsFollowUPValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.deleteProductService({
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
  async getProductsController(req, res) {
    try {
      const validate = await ProductsValidation.getProductsValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.getProductsService(req.query);
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getProductDetailController(req, res) {
    try {
      const validate = await ProductsValidation.ProductsFollowUPValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.getProductDetailService(req.query);
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getProductRestockController(req, res) {
    try {
      const validate = await ProductsValidation.getProductsValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.getProductRestocksService(
        req.query
      );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getProductDetailsController(req, res) {
    try {
      const validate = await ProductsValidation.getCredentialProductValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.getProductDetailsService(
        req.query
      );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getProductFollowUpController(req, res) {
    try {
      const response = await ProductsService.getProductFollowUPService(
        req.query
      );
      console.log(response, "follow");
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async getProductFollowUpDetailController(req, res) {
    try {
      const validate = await ProductsValidation.ProductsFollowUPValidation(
        req.query
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.getProductFollowUPDetailService(
        req.query
      );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async DistributionProductsRequestStocksController(req, res) {
    try {
      const validate = await ProductsValidation.ProductDemandProductValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));
      const response = await ProductsService.ProductDemandRequestService({
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
  async GetProductsDistributionController(req, res) {
    try {
      const validate =
        await ProductsValidation.getProductsDistributionValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.GetProductsDistributionService(
        req.query
      );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async DistributionProductsController(req, res) {
    try {
      const validate = await ProductsValidation.DistributionProductsValidation(
        req.body
      );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await ProductsService.DistributionProductsService({
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
}

module.exports = new ProductsController();
