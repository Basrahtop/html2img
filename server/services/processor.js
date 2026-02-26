const sharp = require("sharp");

async function processImage(buffer, format, quality) {
  if (!buffer) return null;
  if (format === "jpeg") {
    return sharp(buffer).jpeg({ quality }).toBuffer();
  }
  if (format === "webp") {
    return sharp(buffer).webp({ quality }).toBuffer();
  }
  if (format === "png") {
    return sharp(buffer).png().toBuffer();
  }
  return buffer;
}

module.exports = {
  processImage
};
