const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");
const { renderToFile } = require("../utils/renderer");

function getHtmlFiles(dir) {
  return fs.readdirSync(dir).filter((file) => file.endsWith(".html") || file.endsWith(".htm"));
}

module.exports = (program) => {
  program
    .command("batch <dir>")
    .description("Batch convert HTML files in a directory")
    .option("-o, --output <dir>", "Output directory", "outputs")
    .option("-w, --width <pixels>", "Width", "1920")
    .option("-h, --height <pixels>", "Height", "1080")
    .option("-f, --format <type>", "Format: png, jpeg, webp", "png")
    .option("-q, --quality <1-100>", "Quality", "90")
    .option("-t, --transparent", "Transparent background")
    .option("-s, --scale <factor>", "Device scale factor", "1")
    .option("-d, --delay <ms>", "Delay before capture", "0")
    .option("--full-page", "Capture full page")
    .option("--selector <css>", "Capture specific element")
    .option("--inject-css <css>", "Inject custom CSS")
    .option("--inject-js <js>", "Inject custom JS")
    .action(async (dir, options) => {
      const spinner = ora("Processing batch...").start();
      try {
        const files = getHtmlFiles(dir);
        if (!files.length) {
          spinner.fail("No HTML files found.");
          return;
        }
        for (const file of files) {
          const input = path.join(dir, file);
          const output = path.join(options.output, `${path.parse(file).name}.${options.format}`);
          await renderToFile({
            input,
            output,
            width: Number(options.width),
            height: Number(options.height),
            format: options.format,
            quality: Number(options.quality),
            transparent: Boolean(options.transparent),
            deviceScaleFactor: Number(options.scale),
            delay: Number(options.delay),
            fullPage: Boolean(options.fullPage),
            selector: options.selector || null,
            injectCSS: options.injectCss || "",
            injectJS: options.injectJs || ""
          });
        }
        spinner.succeed(`Saved ${files.length} images to ${chalk.green(options.output)}`);
      } catch (error) {
        spinner.fail(error.message);
        process.exitCode = 1;
      }
    });
};
