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
  responseType: "binary"
};

const ALLOWED_FORMATS = ["png", "jpeg", "webp"];

module.exports = {
  DEFAULTS,
  ALLOWED_FORMATS
};
