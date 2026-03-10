const { DEFAULTS, ALLOWED_FORMATS } = require("../../shared/constants");

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeOptions(input = {}) {
  const format = (input.format || DEFAULTS.format).toLowerCase();
  const normalized = {
    html: input.html || "",
    width: toNumber(input.width, DEFAULTS.width),
    height: toNumber(input.height, DEFAULTS.height),
    format: ALLOWED_FORMATS.includes(format) ? format : DEFAULTS.format,
    quality: toNumber(input.quality, DEFAULTS.quality),
    transparent: Boolean(input.transparent),
    deviceScaleFactor: toNumber(input.deviceScaleFactor, DEFAULTS.deviceScaleFactor),
    delay: toNumber(input.delay, DEFAULTS.delay),
    fullPage: Boolean(input.fullPage),
    selector: input.selector || null,
    injectCSS: input.injectCSS || "",
    injectJS: input.injectJS || "",
    responseType: input.responseType || DEFAULTS.responseType,
    // PDF-specific options
    pageFormat: input.pageFormat || DEFAULTS.pageFormat,
    landscape: Boolean(input.landscape),
    printBackground: input.printBackground !== undefined ? Boolean(input.printBackground) : DEFAULTS.printBackground,
    marginTop: input.marginTop || DEFAULTS.marginTop,
    marginRight: input.marginRight || DEFAULTS.marginRight,
    marginBottom: input.marginBottom || DEFAULTS.marginBottom,
    marginLeft: input.marginLeft || DEFAULTS.marginLeft
  };

  if (normalized.quality < 1) normalized.quality = 1;
  if (normalized.quality > 100) normalized.quality = 100;
  if (normalized.width < 1) normalized.width = DEFAULTS.width;
  if (normalized.height < 1) normalized.height = DEFAULTS.height;
  if (normalized.deviceScaleFactor < 1) normalized.deviceScaleFactor = 1;

  return normalized;
}

function validateRequest(req, res, next) {
  try {
    req.normalized = normalizeOptions(req.body || {});
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid request", details: error.message });
  }
}

module.exports = {
  normalizeOptions,
  validateRequest
};
