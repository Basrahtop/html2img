#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const ora = require("ora");
const pkg = require("../package.json");
const convertCommand = require("./commands/convert");
const batchCommand = require("./commands/batch");
const watchCommand = require("./commands/watch");
const { renderToFile } = require("./utils/renderer");

const program = new Command();

program
  .name("html2img")
  .description("HTML to Image conversion tool")
  .version(pkg.version)
  .option("--config <file>", "Load settings from config JSON");

convertCommand(program);
batchCommand(program);
watchCommand(program);

program.hook("preAction", async (thisCommand) => {
  const configPath = thisCommand.opts().config;
  if (!configPath) {
    return;
  }

  const spinner = ora("Processing config...").start();
  try {
    const configFile = path.resolve(configPath);
    const config = JSON.parse(fs.readFileSync(configFile, "utf8"));
    const files = Array.isArray(config.files) ? config.files : [];
    if (!files.length) {
      spinner.fail("No files found in config.");
      process.exit(1);
    }

    for (const entry of files) {
      await renderToFile({
        input: entry.input,
        output: entry.output,
        width: entry.width,
        height: entry.height,
        format: entry.format,
        quality: entry.quality,
        transparent: entry.transparent,
        deviceScaleFactor: entry.deviceScaleFactor,
        delay: entry.delay,
        fullPage: entry.fullPage,
        selector: entry.selector,
        injectCSS: entry.injectCSS,
        injectJS: entry.injectJS
      });
    }

    spinner.succeed("Config batch completed.");
    process.exit(0);
  } catch (error) {
    spinner.fail(error.message);
    process.exit(1);
  }
});

program.parse(process.argv);
