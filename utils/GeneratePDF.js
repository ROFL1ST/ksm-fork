const puppeteer = require("puppeteer");

exports.generatePDF = async (htmlContent) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1240, height: 1754 });
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    // path: "surat-jalan.pdf",
    format: "A4",
    printBackground: true,
    margin: {
      top: "15mm",
      right: "15mm",
      bottom: "15mm",
      left: "15mm",
    },
  });

  await browser.close();
  return pdfBuffer;
};
