const previewIframe = document.getElementById("previewIframe");
const previewFrame = document.getElementById("previewFrame");
const previewWrapper = document.getElementById("previewWrapper");
const gridOverlay = document.getElementById("gridOverlay");

let currentWidth = 1920;
let currentHeight = 1080;
let currentZoom = 1;
let highlightedElement = null;

function updatePreview(html) {
  previewIframe.srcdoc = html;
}

function updateViewport(width, height) {
  currentWidth = width;
  currentHeight = height;
  previewIframe.style.width = `${width}px`;
  previewIframe.style.height = `${height}px`;
  gridOverlay.style.width = `${width}px`;
  gridOverlay.style.height = `${height}px`;
  
  setZoom(currentZoom);
}

function setZoom(scale) {
  currentZoom = Number(scale);
  
  previewWrapper.style.transform = `scale(${currentZoom})`;
  previewWrapper.style.width = `${currentWidth * currentZoom}px`;
  previewWrapper.style.height = `${currentHeight * currentZoom}px`;
}

function toggleGrid(show) {
  gridOverlay.classList.toggle("active", show);
}

function highlightSelector(selector) {
  if (!previewIframe.contentWindow) return;
  
  const doc = previewIframe.contentWindow.document;
  
  if (highlightedElement) {
    highlightedElement.classList.remove("html2img-highlight");
    highlightedElement = null;
  }
  
  const style = doc.getElementById("html2img-highlight-style");
  if (style) style.remove();
  
  if (!selector) return;
  
  try {
    const element = doc.querySelector(selector);
    if (!element) return;
    
    const styleTag = doc.createElement("style");
    styleTag.id = "html2img-highlight-style";
    styleTag.textContent = `
      .html2img-highlight {
        outline: 3px solid #38bdf8 !important;
        outline-offset: 2px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6) !important;
        position: relative !important;
        z-index: 9999 !important;
      }
    `;
    doc.head.appendChild(styleTag);
    
    element.classList.add("html2img-highlight");
    highlightedElement = element;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (e) {
    console.warn("Invalid selector:", selector);
  }
}

window.preview = {
  updatePreview,
  updateViewport,
  setZoom,
  toggleGrid,
  highlightSelector
};

previewFrame.addEventListener("click", () => {
  previewIframe.contentWindow?.focus();
});
