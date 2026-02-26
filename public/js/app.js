const htmlInput = document.getElementById("htmlInput");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const lockRatioInput = document.getElementById("lockRatio");
const formatInput = document.getElementById("format");
const qualityInput = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const transparentInput = document.getElementById("transparent");
const fullPageInput = document.getElementById("fullPage");
const scaleInput = document.getElementById("scale");
const delayInput = document.getElementById("delay");
const selectorInput = document.getElementById("selector");
const injectCSSInput = document.getElementById("injectCSS");
const injectJSInput = document.getElementById("injectJS");
const presetSelect = document.getElementById("presetSelect");
const status = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const downloadZipBtn = document.getElementById("downloadZipBtn");
const advancedToggle = document.getElementById("advancedToggle");
const advancedPanel = document.getElementById("advancedPanel");
const themeToggle = document.getElementById("themeToggle");
const gridToggle = document.getElementById("gridToggle");

let latestBlob = null;
let latestFilename = "output.png";
let aspectRatio = Number(widthInput.value) / Number(heightInput.value);

function updateQualityLabel() {
  qualityValue.textContent = qualityInput.value;
}

function setStatus(message, type = "") {
  status.textContent = message;
  status.className = `status ${type}`;
}

function getPayload() {
  return {
    html: htmlInput.value,
    width: Number(widthInput.value),
    height: Number(heightInput.value),
    format: formatInput.value,
    quality: Number(qualityInput.value),
    transparent: transparentInput.checked,
    deviceScaleFactor: Number(scaleInput.value),
    delay: Number(delayInput.value),
    fullPage: fullPageInput.checked,
    selector: selectorInput.value || null,
    injectCSS: injectCSSInput.value,
    injectJS: injectJSInput.value
  };
}

async function loadPresets() {
  const response = await fetch("/api/presets");
  const presets = await response.json();
  const options = [];
  Object.entries(presets).forEach(([group, items]) => {
    items.forEach((item) => {
      options.push({ label: `${group.toUpperCase()} - ${item.name}`, ...item });
    });
  });
  options.forEach((item) => {
    const option = document.createElement("option");
    option.value = `${item.width}x${item.height}`;
    option.textContent = item.label;
    option.dataset.width = item.width;
    option.dataset.height = item.height;
    presetSelect.appendChild(option);
  });
}

async function generateImage() {
  const queuedFiles = window.uploader.getQueuedFiles();
  setStatus("Generating...");
  generateBtn.disabled = true;

  try {
    if (queuedFiles.length > 1) {
      const formData = new FormData();
      queuedFiles.forEach((file) => formData.append("files", file));
      const payload = getPayload();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

      const response = await fetch("/api/batch", { method: "POST", body: formData });
      const data = await response.json();
      latestBlob = data;
      downloadZipBtn.classList.remove("hidden");
      setStatus(`Generated ${data.results.length} images.`);
      return;
    }

    if (queuedFiles.length === 1) {
      const formData = new FormData();
      formData.append("file", queuedFiles[0]);
      const payload = getPayload();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Conversion failed");
      }
      const blob = await response.blob();
      latestBlob = blob;
      latestFilename = `output.${formatInput.value}`;
      downloadBtn.classList.remove("hidden");
      setStatus("Image ready.");
      return;
    }

    const response = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getPayload())
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Conversion failed");
    }

    const blob = await response.blob();
    latestBlob = blob;
    latestFilename = `output.${formatInput.value}`;
    downloadBtn.classList.remove("hidden");
    setStatus("Image ready.");
  } catch (error) {
    setStatus(error.message || "Something went wrong.", "error");
  } finally {
    generateBtn.disabled = false;
  }
}

function downloadLatest() {
  if (!latestBlob) return;
  const url = URL.createObjectURL(latestBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = latestFilename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadZip() {
  if (!latestBlob || !latestBlob.results) return;
  const zip = new JSZip();
  latestBlob.results.forEach((item) => {
    zip.file(item.filename, item.data, { base64: true });
  });
  zip.generateAsync({ type: "blob" }).then((content) => {
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "html2img-batch.zip";
    link.click();
    URL.revokeObjectURL(url);
  });
}

htmlInput.addEventListener("input", () => window.preview.updatePreview(htmlInput.value));
qualityInput.addEventListener("input", updateQualityLabel);

function updatePreviewDimensions() {
  const w = Number(widthInput.value) || 1920;
  const h = Number(heightInput.value) || 1080;
  window.preview.updateViewport(w, h);
}

presetSelect.addEventListener("change", (event) => {
  const option = event.target.selectedOptions[0];
  if (option?.dataset.width) {
    widthInput.value = option.dataset.width;
    heightInput.value = option.dataset.height;
    aspectRatio = Number(widthInput.value) / Number(heightInput.value);
    updatePreviewDimensions();
  }
});

selectorInput.addEventListener("input", () => {
  setTimeout(() => {
    window.preview.highlightSelector(selectorInput.value);
  }, 500);
});

widthInput.addEventListener("input", () => {
  if (!lockRatioInput.checked) {
    aspectRatio = Number(widthInput.value) / Number(heightInput.value || 1);
  } else {
    const newHeight = Math.round(Number(widthInput.value) / (aspectRatio || 1));
    if (Number.isFinite(newHeight)) {
      heightInput.value = newHeight;
    }
  }
  updatePreviewDimensions();
});

heightInput.addEventListener("input", () => {
  if (!lockRatioInput.checked) {
    aspectRatio = Number(widthInput.value || 1) / Number(heightInput.value);
  } else {
    const newWidth = Math.round(Number(heightInput.value) * (aspectRatio || 1));
    if (Number.isFinite(newWidth)) {
      widthInput.value = newWidth;
    }
  }
  updatePreviewDimensions();
});

advancedToggle.addEventListener("click", () => {
  advancedPanel.classList.toggle("open");
});

themeToggle.addEventListener("change", (event) => {
  document.body.classList.toggle("dark", event.target.checked);
});

gridToggle.addEventListener("change", (event) => {
  window.preview.toggleGrid(event.target.checked);
});

document.querySelectorAll(".zoom button").forEach((btn) => {
  btn.addEventListener("click", () => window.preview.setZoom(btn.dataset.zoom));
});

resetBtn.addEventListener("click", () => {
  htmlInput.value = "";
  window.uploader.clear();
  window.preview.updatePreview(htmlInput.value);
  downloadBtn.classList.add("hidden");
  downloadZipBtn.classList.add("hidden");
  setStatus("");
});

downloadBtn.addEventListener("click", downloadLatest);

downloadZipBtn.addEventListener("click", () => {
  if (!window.JSZip) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
    script.onload = downloadZip;
    document.body.appendChild(script);
  } else {
    downloadZip();
  }
});

generateBtn.addEventListener("click", generateImage);

updateQualityLabel();
window.preview.updatePreview(htmlInput.value);
updatePreviewDimensions();
loadPresets();
