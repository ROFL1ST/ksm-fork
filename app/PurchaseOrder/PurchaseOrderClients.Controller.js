const { PurchaseOrderClientService } = require("../../service");
const {
  OutParser: { OutFailed, OutSuccess },
  PrintPDF: { generatePDF },
} = require("../../utils");

const { PurchaseOrderClientsValidation } = require("./validation");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
class PurchaseOrderClientController {
  async PostPurchaseOrderClientController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.CreatePOCleintsValidation(
          req.body
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderClientService.PostService({
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
  async UpdatePurchaseOrderClientController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.UpdatePOCleintsValidation(
          req.body
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderClientService.UpdateService({
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
  async DeletePurchaseOrderClientController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderClientService.DeleteService({
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
  async GetPurchaseOrderClientSalesController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.GetAllDocumentsValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));
      const response = await PurchaseOrderClientService.GetServiceSales({
        ...req.query,
        ...req.user,
      });
      if (response)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      console.log(e);
      return res.send(OutFailed(null, e.message));
    }
  }
  async GetOnePurchaseOrderClientSalesController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));
      const response = await PurchaseOrderClientService.GetOneService({
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
  async GetPurchaseOrderClientController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.GetAllDocumentsValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderClientService.GetService(req.query);
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
        await PurchaseOrderClientsValidation.ManagePurchaseOrderValidation(
          req.body
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderClientService.PurchaseOrderTravelDocumentDescriptionService(
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
        await PurchaseOrderClientsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderClientService.GetPurchaseOrderTravelDocumentDescriptionService(
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

  async TravelDocumentPurchaseOrderClientController(req, res) {
    try {
      const response = await PurchaseOrderClientService.TravelDocumentService({
        ...req.query,
        ...req.user,
      });

      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      // const htmlTemplate = fs.readFileSync("travel-document.ejs", "utf8");
      const htmlTemplate = fs.readFileSync(
        path.resolve(__dirname, "../../report/travel-document.ejs"),
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
  async GetAssetsPurchaseOrderClientController(req, res) {
    try {
      const response = await PurchaseOrderClientService.GetAssetsDataService();
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async GetPurchaseOrderDeliveryHistoriesController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.GetAllDocumentsValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response = await PurchaseOrderClientService.getByDriverIDService({
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
  async GetPurchaseOrderDeliveryHistoryDetailController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.DetailPurchaseOrderValidation(
          req.query
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderClientService.getTrvelDocumentDetailService(
          req.query
        );
      if (response.status)
        return res.send(OutSuccess(response.response, response.messages));
      return res.send(OutFailed(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(null, e.message));
    }
  }
  async UpdatePurchaseOrderDeliveryHistoryDetailController(req, res) {
    try {
      const validate =
        await PurchaseOrderClientsValidation.UpdatePurchaseOrderDeliveryValidation(
          req.body
        );
      if (!validate.status)
        return res.send(OutFailed(null, validate.validation));

      const response =
        await PurchaseOrderClientService.updateTrvelDocumentDetailService({
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

module.exports = new PurchaseOrderClientController();
