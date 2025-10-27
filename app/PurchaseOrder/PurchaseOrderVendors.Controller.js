const { PurchaseOrderVendorsService } = require("../../service");
const {
  OutParser: { OutFailed, OutSuccess },
  PrintPDF: { generatePDF },
} = require("../../utils");

const { PurchaseOrderVendorsValidation } = require("./validation");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
class PurchaseOrderVendorsController {
  async PostPurchaseOrderVendorsController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.CreateVendorValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderVendorsService.PostService({
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
  async UpdatePurchaseOrderVendorsController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.UpdateVendorValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderVendorsService.UpdateService(
        req.body
      );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async DeletePurchaseOrderVendorsController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderVendorsService.DeleteService({
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
  async GetOnePurchaseOrderVendorsSalesController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));
      const response = await PurchaseOrderVendorsService.GetOneService({
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
  async GetPurchaseOrderVendorsController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.GetAllDocumentsValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderVendorsService.GetService(req.query);
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async ManagePurchaseOrderTravelDocumentDescriptionController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.ManagePurchaseOrderValidation(
          req.body
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.PurchaseOrderTravelDocumentDescriptionService(
          req.body
        );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async GetPurchaseOrderTravelDocumentDescriptionController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.GetPurchaseOrderTravelDocumentDescriptionService(
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

  async TravelDocumentPurchaseOrderVendorsController(req, res) {
    try {
      const response = await PurchaseOrderVendorsService.TravelDocumentService({
        ...req.query,
        ...req.user,
      });
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      const htmlTemplate = fs.readFileSync(
        path.resolve(__dirname, "../../report/purchase-order-vendor.ejs"),
        "utf8"
      );
      const renderedHtml = ejs.render(htmlTemplate, {
        data: response.response,
      });

      const pdfBuffer = await generatePDF(renderedHtml);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="travel-document.pdf"',
        "Content-Length": pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async PurchaseOrderExportDeliveryReceivedController(req, res) {
    try {
      const response =
        await PurchaseOrderVendorsService.TravelDocumentDeliveryVendorService({
          ...req.query,
          ...req.user,
        });

      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      const htmlTemplate = fs.readFileSync(
        path.resolve(
          __dirname,
          "../../report/purchase-order-vendor-delivery-proof.ejs"
        ),
        "utf8"
      );
      const renderedHtml = ejs.render(htmlTemplate, {
        data: response.response,
      });

      const pdfBuffer = await generatePDF(renderedHtml);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="travel-document.pdf"',
        "Content-Length": pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async GetAssetsPurchaseOrderVendorsController(req, res) {
    try {
      const response = await PurchaseOrderVendorsService.GetAssetsDataService();
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async PurchaseOrderProductsReceivedController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.DetailPurchaseOrderByCodeValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.ProductsReceivedService(req.query);
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async PurchaseOrderProductsDeliveryController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.PurchaseOrderProductsDeliveryReceived(
          req.query
        );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async PurchaseOrderDeliveryReceivedController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.PurchaseOrderProductsDelivery(
          req.query
        );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async PurchaseOrderDeleteDeliveryReceivedController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.DetailPurchaseOrderDeliveryIDValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.PurchaseOrderProductsDeliveryDelete({
          ...req.query,
          ...req.user,
        });
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async PurchaseOrderUpdateDeliveryReceivedController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.UpdatePurchaseOrderDeliveryDetailValidation(
          req.body
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.PurchaseOrderProductsDeliveryUpdate({
          ...req.body,
          ...req.user,
        });
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async CreatePurchaseOrderProductsDeliveryController(req, res) {
    try {
      const validate =
        await PurchaseOrderVendorsValidation.CreatePurchaseOrderDeliveryDetailValidation(
          req.body
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderVendorsService.CreatePurchaseOrderProductsDelivery({
          ...req.body,
          ...req.user,
        });
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
}

module.exports = new PurchaseOrderVendorsController();
