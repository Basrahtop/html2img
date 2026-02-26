const path = require("path");

function ensureHtmlDocument(html) {
  if (!html) {
    return "<!doctype html><html><head></head><body></body></html>";
  }
  const trimmed = html.trim().toLowerCase();
  if (trimmed.startsWith("<!doctype") || trimmed.startsWith("<html")) {
    return html;
  }
  return `<!doctype html><html><head></head><body>${html}</body></html>`;
}

function safeFilename(name, fallback = "output") {
  const base = path.parse(name || fallback).name || fallback;
  return base.replace(/[^a-z0-9_-]/gi, "_");
}

module.exports = {
  ensureHtmlDocument,
  safeFilename
};
