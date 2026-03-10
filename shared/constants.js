const DEFAULTS = {
  width: 1920,
  height: 1080,
  format: "png",
  quality: 90,
  transparent: false,
  deviceScaleFactor: 1,
  delay: 0,
  fullPage: false,
  selector: null,
  injectCSS: "",
  injectJS: "",
  responseType: "binary",
  // PDF-specific
  pageFormat: "A4",
  landscape: false,
  printBackground: true,
  marginTop: "0",
  marginRight: "0",
  marginBottom: "0",
  marginLeft: "0"
};

const ALLOWED_FORMATS = ["png", "jpeg", "webp", "pdf"];

const PDF_PAGE_FORMATS = ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"];

module.exports = {
  DEFAULTS,
  ALLOWED_FORMATS,
  PDF_PAGE_FORMATS
};
