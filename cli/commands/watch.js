const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const ora = require("ora");
const { renderToFile } = require("../utils/renderer");

module.exports = (program) => {
  program
    .command("watch <dir>")
    .description("Watch a directory and auto-regenerate on change")
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
    .action((dir, options) => {
      const spinner = ora("Watching for changes...").start();
      const watcher = chokidar.watch(dir, { ignoreInitial: true });

      watcher.on("add", (file) => handleChange(file, options, spinner));
      watcher.on("change", (file) => handleChange(file, options, spinner));
    });
};

async function handleChange(file, options, spinner) {
  if (!file.endsWith(".html") && !file.endsWith(".htm")) {
    return;
  }
  try {
    spinner.text = `Rendering ${path.basename(file)}...`;
    const output = path.join(options.output, `${path.parse(file).name}.${options.format}`);
    await renderToFile({
      input: file,
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
    spinner.succeed(`Updated ${path.basename(output)}`);
  } catch (error) {
    spinner.fail(error.message);
  }
}
