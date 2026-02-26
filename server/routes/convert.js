const express = require("express");
const fs = require("fs");
const path = require("path");
const upload = require("../middleware/upload");
const { validateRequest, normalizeOptions } = require("../middleware/validator");
const { renderHtmlToImage } = require("../services/renderer");
const { processImage } = require("../services/processor");
const { safeFilename } = require("../utils/helpers");

const router = express.Router();

router.post("/convert", validateRequest, async (req, res) => {
  try {
    const options = req.normalized;
    const buffer = await renderHtmlToImage(options);
    const processed = await processImage(buffer, options.format, options.quality);
    const finalBuffer = processed || buffer;

    if (options.responseType === "base64") {
      return res.json({ image: finalBuffer.toString("base64"), size: finalBuffer.length });
    }

    res.set("Content-Type", `image/${options.format}`);
    return res.send(finalBuffer);
  } catch (error) {
    return res.status(500).json({ error: "Conversion failed", details: error.message });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const html = fs.readFileSync(filePath, "utf8");
    const options = normalizeOptions({ ...req.body, html });

    const buffer = await renderHtmlToImage(options);
    const processed = await processImage(buffer, options.format, options.quality);
    const finalBuffer = processed || buffer;

    fs.unlinkSync(filePath);

    if (options.responseType === "base64") {
      return res.json({ image: finalBuffer.toString("base64"), size: finalBuffer.length });
    }

    res.set("Content-Type", `image/${options.format}`);
    return res.send(finalBuffer);
  } catch (error) {
    return res.status(500).json({ error: "Upload conversion failed", details: error.message });
  }
});

router.post("/batch", upload.array("files"), async (req, res) => {
  try {
    const results = [];
    const items = Array.isArray(req.body.items) ? req.body.items : null;

    if (items) {
      for (const item of items) {
        const options = normalizeOptions(item);
        const buffer = await renderHtmlToImage(options);
        const processed = await processImage(buffer, options.format, options.quality);
        const finalBuffer = processed || buffer;
        results.push({
          filename: `${safeFilename(item.output || "output")}.${options.format}`,
          data: finalBuffer.toString("base64"),
          size: finalBuffer.length
        });
      }
      return res.json({ results });
    }

    const files = req.files || [];
    for (const file of files) {
      const html = fs.readFileSync(file.path, "utf8");
      const options = normalizeOptions({ ...req.body, html });
      const buffer = await renderHtmlToImage(options);
      const processed = await processImage(buffer, options.format, options.quality);
      const finalBuffer = processed || buffer;
      results.push({
        filename: `${safeFilename(path.basename(file.originalname, path.extname(file.originalname)))}.${options.format}`,
        data: finalBuffer.toString("base64"),
        size: finalBuffer.length
      });
      fs.unlinkSync(file.path);
    }

    return res.json({ results });
  } catch (error) {
    return res.status(500).json({ error: "Batch conversion failed", details: error.message });
  }
});

module.exports = router;
