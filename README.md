# HTML2IMG

> **Convert HTML into high-quality images (PNG, JPEG, WebP)** with a modern web interface, REST API, and powerful CLI.

[![Deploy](https://img.shields.io/badge/Deploy-Render-blueviolet)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen)](https://nodejs.org)

Transform your HTML designs, mockups, and templates into pixel-perfect images. Perfect for generating marketing assets, social media graphics, design previews, and automated screenshot workflows.

![HTML2IMG Demo](https://via.placeholder.com/1200x600/1E1243/ffffff?text=HTML2IMG+Demo)

---

## ✨ Features

### 🎨 **Web UI**
- **Live HTML Editor** - Write or paste HTML with real-time preview
- **Drag & Drop** - Upload HTML files instantly
- **Smart Preview** - See exactly what will be generated with accurate viewport simulation
- **Dimension Control** - Custom sizes or quick presets (Desktop, Mobile, Tablet, Social Media)
- **Format Options** - Export as PNG, JPEG, or WebP with quality control
- **Selector Capture** - Target specific elements using CSS selectors (with visual highlighting)
- **Batch Processing** - Convert multiple files and download as ZIP
- **Dark Mode** - Eye-friendly interface toggle
- **Zoom Controls** - 50% and 100% preview zoom with proper scrolling
- **Aspect Ratio Lock** - Maintain proportions when resizing

### 🔌 **REST API**
- **Single Conversion** - `POST /api/convert` - Convert HTML string to image
- **File Upload** - `POST /api/upload` - Upload and convert HTML files
- **Batch Processing** - `POST /api/batch` - Process multiple files at once
- **Dimension Presets** - `GET /api/presets` - Get standard device dimensions
- **Advanced Options** - Transparent backgrounds, device scaling, delays, full-page capture

### 💻 **CLI Tool**
- **Single File Conversion** - `html2img convert <file.html>`
- **Batch Processing** - `html2img batch <directory>`
- **Watch Mode** - `html2img watch <directory>` - Auto-regenerate on changes
- **Config Files** - Define complex batch jobs with JSON configs
- **Full Control** - All web UI features available via command-line flags

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/html2img.git
cd html2img

# Install dependencies
npm install

# Start the server
npm start
```

Open http://localhost:3000 in your browser.

---

## 📖 Usage

### Web Interface

1. **Paste or upload HTML** in the left panel
2. **Adjust dimensions** (or pick a preset like "Full HD", "iPhone", "Instagram")
3. **Preview in real-time** - See exactly what will be generated
4. **Configure options**:
   - Output format (PNG/JPEG/WebP)
   - Quality slider (for JPEG/WebP)
   - Transparent background (PNG/WebP only)
   - Advanced: CSS selector, custom CSS/JS injection, device scaling
5. **Click "Generate Image"**
6. **Download** your image

**Batch Mode:**
- Upload multiple HTML files
- All settings apply to each file
- Download all as a ZIP archive

**Selector Feature:**
- Enter a CSS selector in Advanced Options (e.g., `.hero-section`, `#banner`)
- The preview highlights the target element
- Only that element is captured in the final image

---

## 🔗 API Reference

### Base URL
```
http://localhost:3000/api
```

### POST `/convert`
Convert HTML string to image.

**Request Body:**
```json
{
  "html": "<div style='padding: 40px; background: #1E1243; color: white;'><h1>Hello World</h1></div>",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "quality": 90,
  "transparent": false,
  "deviceScaleFactor": 2,
  "delay": 0,
  "fullPage": false,
  "selector": null,
  "injectCSS": "",
  "injectJS": ""
}
```

**Response:**
- Binary image data (Content-Type: `image/png`)

**Example:**
```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1 style=\"color:blue\">Test</h1>","width":800,"height":600}' \
  --output test.png
```

---

### POST `/upload`
Upload HTML file for conversion.

**Request:**
- Content-Type: `multipart/form-data`
- Field `file`: HTML file
- Additional fields: `width`, `height`, `format`, `quality`, etc.

**Example:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@design.html" \
  -F "width=1920" \
  -F "height=1080" \
  -F "format=png" \
  --output design.png
```

---

### POST `/batch`
Convert multiple HTML files.

**Request:**
- Content-Type: `multipart/form-data`
- Field `files`: Multiple HTML files
- Additional fields: `width`, `height`, `format`, etc.

**Response:**
```json
{
  "results": [
    {
      "filename": "design1.png",
      "data": "base64_encoded_image_data",
      "size": 45678
    },
    {
      "filename": "design2.png",
      "data": "base64_encoded_image_data",
      "size": 52341
    }
  ]
}
```

---

### GET `/presets`
Get available dimension presets.

**Response:**
```json
{
  "desktop": [
    { "name": "Full HD", "width": 1920, "height": 1080 },
    { "name": "HD", "width": 1366, "height": 768 }
  ],
  "mobile": [
    { "name": "iPhone", "width": 375, "height": 667 },
    { "name": "Android", "width": 360, "height": 640 }
  ],
  "tablet": [
    { "name": "iPad", "width": 768, "height": 1024 }
  ],
  "social": [
    { "name": "Facebook", "width": 1200, "height": 630 },
    { "name": "Twitter", "width": 1200, "height": 675 },
    { "name": "Instagram", "width": 1080, "height": 1080 }
  ]
}
```

---

## 🖥️ CLI Usage

### Install Globally
```bash
npm install -g .
# or during development
npm link
```

### Commands

**Convert Single File:**
```bash
html2img convert input.html -o output.png

# With options
html2img convert banner.html \
  --width 2400 \
  --height 800 \
  --format jpeg \
  --quality 85 \
  --transparent
```

**Batch Convert Directory:**
```bash
html2img batch ./designs/ -o ./output/

# With custom settings
html2img batch ./designs/ \
  --output ./images/ \
  --format png \
  --width 1920 \
  --height 1080
```

**Watch Mode (Auto-regenerate):**
```bash
html2img watch ./designs/ -o ./output/
# Watches for file changes and automatically regenerates images
```

**Config File:**
```bash
html2img --config config.json
```

**config.json example:**
```json
{
  "files": [
    {
      "input": "hero.html",
      "output": "hero.png",
      "width": 1920,
      "height": 1080
    },
    {
      "input": "card.html",
      "output": "card.jpg",
      "width": 1200,
      "height": 630,
      "format": "jpeg",
      "quality": 90
    }
  ]
}
```

### CLI Options

| Flag | Description | Default |
|------|-------------|---------|
| `-o, --output <file>` | Output file path | `output.{format}` |
| `-w, --width <px>` | Width in pixels | `1920` |
| `-h, --height <px>` | Height in pixels | `1080` |
| `-f, --format <type>` | Format: png, jpeg, webp | `png` |
| `-q, --quality <1-100>` | Quality (JPEG/WebP) | `90` |
| `-t, --transparent` | Transparent background | `false` |
| `-s, --scale <factor>` | Device scale factor | `1` |
| `-d, --delay <ms>` | Delay before capture | `0` |
| `--full-page` | Capture full scrollable page | `false` |
| `--selector <css>` | Capture specific element | - |
| `--inject-css <css>` | Inject custom CSS | - |
| `--inject-js <js>` | Inject custom JS | - |

---

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Rendering Engine:** Puppeteer (Headless Chrome)
- **Image Processing:** Sharp
- **File Handling:** Multer, Archiver
- **CLI:** Commander.js, Ora, Chalk
- **Frontend:** Vanilla JavaScript, Custom CSS

---

## 📦 Deployment

### Deploy to Render

1. **Push to GitHub** (see instructions below)

2. **Create Render Account** at [render.com](https://render.com)

3. **Create New Web Service:**
   - Connect your GitHub repository
   - Select branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Configure Environment:**
   - Add environment variable: `PORT=3000`

5. **Deploy** - Render will automatically build and deploy

Your app will be live at: `https://your-app-name.onrender.com`

---

## 🐙 GitHub Setup

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HTML2IMG tool"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/html2img.git
git branch -M main
git push -u origin main
```

---

## 📝 Examples

### Generate Social Media Banner
```javascript
// Via API
const response = await fetch('http://localhost:3000/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    html: `<div style="width: 1200px; height: 630px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: Arial; font-size: 48px; font-weight: bold;">My Awesome Post</div>`,
    width: 1200,
    height: 630,
    format: 'png'
  })
});
const blob = await response.blob();
```

### Capture Specific Element
```bash
# CLI: Only capture the .hero-section element
html2img convert landing.html \
  --selector ".hero-section" \
  --output hero.png
```

### Generate Retina Images
```bash
# 2x resolution for sharp displays
html2img convert design.html \
  --width 1920 \
  --height 1080 \
  --scale 2 \
  --output design@2x.png
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- Built with [Puppeteer](https://pptr.dev/)
- Powered by [Node.js](https://nodejs.org/)
- UI inspired by modern design principles

---

**Made with ❤️ for developers and designers**
