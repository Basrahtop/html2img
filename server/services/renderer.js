const puppeteer = require("puppeteer");
const { ensureHtmlDocument } = require("../utils/helpers");

async function renderHtmlToImage(options) {
  const {
    html,
    width,
    height,
    format,
    quality,
    transparent,
    deviceScaleFactor,
    delay,
    fullPage,
    selector,
    injectCSS,
    injectJS
  } = options;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

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

    const screenshotOptions = {
      type: format,
      fullPage: Boolean(fullPage)
    };

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

    return buffer;
  } finally {
    await browser.close();
  }
}

module.exports = {
  renderHtmlToImage
};
