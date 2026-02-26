const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

let queuedFiles = [];

function renderFileList() {
  if (!queuedFiles.length) {
    fileList.textContent = "";
    return;
  }
  fileList.innerHTML = queuedFiles.map((file) => `<div>${file.name} (${Math.round(file.size / 1024)}kb)</div>`).join("");
}

function handleFiles(files) {
  queuedFiles = Array.from(files || []);
  renderFileList();
}

fileInput.addEventListener("change", (event) => {
  handleFiles(event.target.files);
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("active");
  handleFiles(event.dataTransfer.files);
});

window.uploader = {
  getQueuedFiles: () => queuedFiles,
  clear: () => {
    queuedFiles = [];
    fileInput.value = "";
    renderFileList();
  }
};
