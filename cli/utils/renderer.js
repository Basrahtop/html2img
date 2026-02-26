const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { DEFAULTS } = require("../../shared/constants");
const { ensureHtmlDocument } = require("../../server/utils/helpers");

async function renderToFile(options) {
  const {
    input,
    output,
    width = DEFAULTS.width,
    height = DEFAULTS.height,
    format = DEFAULTS.format,
    quality = DEFAULTS.quality,
    transparent = DEFAULTS.transparent,
    deviceScaleFactor = DEFAULTS.deviceScaleFactor,
    delay = DEFAULTS.delay,
    fullPage = DEFAULTS.fullPage,
    selector = DEFAULTS.selector,
    injectCSS = DEFAULTS.injectCSS,
    injectJS = DEFAULTS.injectJS
  } = options;

  const html = fs.readFileSync(input, "utf8");
  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor });
    await page.setContent(ensureHtmlDocument(html), { waitUntil: "networkidle0" });

    if (injectCSS) {
      await page.addStyleTag({ content: injectCSS });
    }
    if (injectJS) {
      await page.addScriptTag({ content: injectJS });
    }
    if (delay && delay > 0) {
      await page.waitForTimeout(delay);
    }

    const screenshotOptions = { type: format, fullPage: Boolean(fullPage) };
    if (format !== "png") {
      screenshotOptions.quality = quality;
    }
    if (transparent && format !== "jpeg") {
      screenshotOptions.omitBackground = true;
    }

    let buffer;
    if (selector) {
      const element = await page.$(selector);
      if (!element) {
        throw new Error(`Selector not found: ${selector}`);
      }
      buffer = await element.screenshot(screenshotOptions);
    } else {
      buffer = await page.screenshot(screenshotOptions);
    }

    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, buffer);
  } finally {
    await browser.close();
  }
}

module.exports = {
  renderToFile
};
