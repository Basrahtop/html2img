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
    injectJS,
    pageFormat,
    landscape,
    printBackground,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft
  } = options;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    
    // For PDF, we don't set viewport (uses page format instead)
    if (format !== "pdf") {
      await page.setViewport({ width, height, deviceScaleFactor });
    }
    
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

    let buffer;

    // Handle PDF generation
    if (format === "pdf") {
      const pdfOptions = {
        format: pageFormat || "A4",
        landscape: Boolean(landscape),
        printBackground: Boolean(printBackground),
        margin: {
          top: marginTop || "0",
          right: marginRight || "0",
          bottom: marginBottom || "0",
          left: marginLeft || "0"
        }
      };
      buffer = await page.pdf(pdfOptions);
    } else {
      // Handle image generation (existing logic)
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

      if (selector) {
        const element = await page.$(selector);
        if (!element) {
          throw new Error(`Selector not found: ${selector}`);
        }
        buffer = await element.screenshot(screenshotOptions);
      } else {
        buffer = await page.screenshot(screenshotOptions);
      }
    }

    return buffer;
  } finally {
    await browser.close();
  }
}

module.exports = {
  renderHtmlToImage
};
