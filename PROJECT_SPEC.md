# HTML2IMG - HTML to Image Conversion Tool
## Project Specification Document

---

## PROJECT OVERVIEW

A full-stack web application that converts HTML code/files into high-quality images (PNG, JPEG, WebP). The tool provides a modern web UI for quick conversions, a REST API for integrations, and a CLI for automation workflows.

**Primary Use Cases:**
- Convert frontend design mockups to images
- Generate marketing assets from HTML templates
- Create social media graphics
- Batch process multiple HTML files
- Design iteration with live preview

---

## CORE FEATURES

### 1. Web UI (Priority 1)
- Drag-and-drop HTML files or paste HTML code directly
- Live preview window showing rendered HTML
- Dimension controls (custom width/height or presets)
- Output format selector (PNG, JPEG, WebP)
- Quality/compression settings
- Transparent background option
- Device/viewport presets (mobile, tablet, desktop, social media sizes)
- Batch processing queue
- Download individual files or zip all
- Dark/light mode toggle

### 2. Backend API
- POST `/api/convert` - Convert single HTML to image
- POST `/api/batch` - Process multiple files
- GET `/api/presets` - Get dimension presets
- File upload support
- Stream output or return base64
- Error handling and validation

### 3. CLI Tool
- `html2img convert <file.html>` - Basic conversion
- `--width`, `--height`, `--format`, `--quality` flags
- `--config <file.json>` - Load settings from config
- `--batch <directory>` - Process all HTML files in folder
- `--watch` - Watch mode for auto-regeneration
- `--transparent` - Transparent background
- `--selector <css-selector>` - Capture specific element only

### 4. Advanced Features
- Full page screenshots (scrolling content)
- Capture specific elements by CSS selector
- Inject custom CSS before capture
- Inject custom JavaScript for dynamic content
- Multiple viewport sizes at once (responsive previews)
- Device emulation (iPhone, iPad, Android devices)
- Screenshot delay/wait for animations
- Retina/HiDPI support (2x, 3x scaling)

---

## TECHNICAL STACK

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Optional: React/Vue for more interactive UI
- Drag-and-drop: Native HTML5 API or library
- Code editor: Monaco Editor or CodeMirror for HTML input
- UI Framework: Tailwind CSS or custom CSS

**Backend:**
- Node.js (v18+)
- Express.js
- Puppeteer (headless Chrome for rendering)
- Multer (file uploads)
- Sharp (optional: post-processing, resizing, compression)
- Archiver (zip creation for batch downloads)

**CLI:**
- Commander.js or Yargs (argument parsing)
- Chalk (colored terminal output)
- Ora (loading spinners)

**Development:**
- Nodemon (auto-restart during development)
- ESLint (code quality)
- Concurrently (run frontend + backend together)

---

## ARCHITECTURE

```
┌─────────────┐
│   Web UI    │ (Browser)
│ HTML/CSS/JS │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐
│ Express API │ (Node.js Server)
│  Endpoints  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Puppeteer  │ (Rendering Engine)
│  + Sharp    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Output    │
│ PNG/JPG/etc │
└─────────────┘

CLI Tool → Directly uses Puppeteer (no server needed)
```

---

## FILE STRUCTURE

```
html2img-tool/
├── server/
│   ├── index.js              # Main Express app
│   ├── routes/
│   │   ├── convert.js        # Conversion endpoints
│   │   └── presets.js        # Preset dimensions
│   ├── services/
│   │   ├── renderer.js       # Puppeteer screenshot logic
│   │   └── processor.js      # Image post-processing
│   ├── middleware/
│   │   ├── upload.js         # File upload handling
│   │   └── validator.js      # Request validation
│   ├── utils/
│   │   ├── presets.json      # Dimension presets
│   │   └── helpers.js
│   └── temp/                 # Temporary file storage
│
├── public/
│   ├── index.html            # Main web UI
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js            # Main application logic
│   │   ├── preview.js        # Live preview handling
│   │   └── uploader.js       # Drag-and-drop logic
│   └── assets/
│       └── icons/
│
├── cli/
│   ├── index.js              # CLI entry point
│   ├── commands/
│   │   ├── convert.js        # Convert command
│   │   ├── batch.js          # Batch command
│   │   └── watch.js          # Watch command
│   └── utils/
│       └── renderer.js       # Shared Puppeteer logic
│
├── shared/
│   └── constants.js          # Shared constants/config
│
├── outputs/                  # Generated images (gitignored)
├── examples/                 # Example HTML files
├── package.json
├── .env                      # Environment variables
├── .gitignore
└── README.md                 # Documentation
```

---

## DETAILED FEATURE REQUIREMENTS

### Web UI Specifications

**Layout:**
- Split screen: Left = input/controls, Right = preview
- Responsive design (works on tablets)
- Clean, modern interface

**Input Methods:**
1. **Code Editor**
   - Syntax-highlighted HTML editor
   - Line numbers
   - Auto-formatting option

2. **File Upload**
   - Drag-and-drop zone
   - Click to browse
   - Accept .html, .htm files
   - Show file name and size

**Controls Panel:**
- **Dimensions:**
  - Custom width/height inputs (number fields)
  - Preset dropdown:
    - Desktop: 1920×1080, 1366×768
    - Mobile: 375×667 (iPhone), 360×640 (Android)
    - Tablet: 768×1024 (iPad), 800×1280
    - Social: 1200×630 (Facebook), 1200×675 (Twitter), 1080×1080 (Instagram)
  - Aspect ratio lock toggle

- **Output Format:**
  - Radio buttons or dropdown: PNG, JPEG, WebP
  - Quality slider (for JPEG/WebP): 0-100
  - Transparent background checkbox (PNG/WebP only)

- **Advanced Options (Collapsible):**
  - Device scale factor (1x, 2x, 3x for retina)
  - Capture delay (0-10000ms)
  - Full page screenshot toggle
  - CSS selector input (capture specific element)
  - Inject CSS textarea
  - Inject JS textarea

**Preview Window:**
- Live iframe preview of HTML
- Responsive to dimension changes
- Zoom controls (fit, 50%, 100%, 200%)
- Grid overlay option

**Actions:**
- Primary button: "Generate Image"
- Download button (appears after generation)
- Loading state with progress indicator
- Reset/clear button

**Batch Processing:**
- Upload multiple files
- Queue list showing each file status
- Generate all button
- Download all as ZIP
- Individual download links

---

## API ENDPOINTS

### POST /api/convert
**Description:** Convert single HTML to image

**Request Body:**
```json
{
  "html": "<html>...</html>",
  "width": 1920,
  "height": 1080,
  "format": "png",
  "quality": 90,
  "transparent": false,
  "deviceScaleFactor": 2,
  "delay": 1000,
  "fullPage": false,
  "selector": null,
  "injectCSS": "",
  "injectJS": ""
}
```

**Response:**
- Content-Type: image/png (or jpeg/webp)
- Binary image data
- OR: `{ "image": "base64string", "size": 12345 }`

### POST /api/upload
**Description:** Upload HTML file for conversion

**Request:** multipart/form-data with file + options

**Response:** Same as /api/convert

### POST /api/batch
**Description:** Convert multiple HTML files

**Request:** Array of conversion requests or multipart with multiple files

**Response:** 
```json
{
  "results": [
    { "filename": "design1.png", "data": "base64...", "size": 12345 },
    { "filename": "design2.png", "data": "base64...", "size": 67890 }
  ]
}
```

### GET /api/presets
**Description:** Get available dimension presets

**Response:**
```json
{
  "desktop": [
    { "name": "Full HD", "width": 1920, "height": 1080 },
    { "name": "HD", "width": 1366, "height": 768 }
  ],
  "mobile": [...],
  "tablet": [...],
  "social": [...]
}
```

---

## CLI SPECIFICATIONS

### Installation
```bash
npm install -g html2img
# or link locally during development
npm link
```

### Commands

**Basic Conversion:**
```bash
html2img convert input.html -o output.png
html2img convert input.html --width 1920 --height 1080 --format jpeg --quality 85
```

**Flags:**
- `-o, --output <file>` - Output file path
- `-w, --width <pixels>` - Width (default: 1920)
- `-h, --height <pixels>` - Height (default: 1080)
- `-f, --format <type>` - Format: png, jpeg, webp (default: png)
- `-q, --quality <1-100>` - Quality for JPEG/WebP (default: 90)
- `-t, --transparent` - Transparent background (PNG/WebP only)
- `-s, --scale <factor>` - Device scale factor (default: 1)
- `-d, --delay <ms>` - Wait delay before capture (default: 0)
- `--full-page` - Capture full scrollable page
- `--selector <css>` - Capture specific element only

**Batch Processing:**
```bash
html2img batch ./designs/ -o ./output/
html2img batch ./designs/ --format png --width 1920 --height 1080
```

**Config File:**
```bash
html2img --config config.json
```

config.json:
```json
{
  "files": [
    {
      "input": "banner.html",
      "output": "banner.png",
      "width": 2400,
      "height": 800
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

**Watch Mode:**
```bash
html2img watch ./designs/ -o ./output/
# Watches for changes and auto-regenerates
```

---

## IMPLEMENTATION PHASES

### Phase 1: Core Backend (MVP)
- Express server setup
- Basic Puppeteer rendering service
- Single conversion endpoint
- Error handling
- PNG/JPEG support

### Phase 2: Web UI (MVP)
- Basic HTML interface
- HTML code input (textarea)
- Dimension controls
- Format selector
- Generate and download button
- Preview iframe

### Phase 3: Advanced Features
- File upload support
- Drag-and-drop
- Batch processing
- WebP support
- Transparent backgrounds
- Quality controls
- Preset dimensions

### Phase 4: CLI Tool
- Command structure setup
- Convert command
- Batch command
- Config file support

### Phase 5: Polish & Optimization
- Watch mode
- Advanced options (selectors, inject CSS/JS)
- Better error messages
- UI improvements
- Performance optimization
- Documentation

---

## SETUP & DEVELOPMENT

### Environment Variables (.env)
```
PORT=3000
NODE_ENV=development
TEMP_DIR=./temp
OUTPUT_DIR=./outputs
MAX_FILE_SIZE=10485760
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "nodemon server/index.js",
    "start": "node server/index.js",
    "cli": "node cli/index.js",
    "test": "echo \"Tests not implemented\""
  }
}
```

### Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "puppeteer": "^21.0.0",
    "sharp": "^0.32.0",
    "multer": "^1.4.5-lts.1",
    "archiver": "^6.0.0",
    "commander": "^11.0.0",
    "chalk": "^5.3.0",
    "ora": "^7.0.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "eslint": "^8.50.0"
  }
}
```

### Running the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:3000
# Open browser to access web UI

# Use CLI
npm run cli -- convert example.html -o output.png
```

---

## SUCCESS CRITERIA

✅ User can paste HTML and generate PNG in under 3 seconds
✅ Web UI is intuitive and requires no documentation
✅ Batch processing handles 10+ files efficiently
✅ CLI supports all major use cases
✅ Output images are high quality and accurate to HTML
✅ Works on Windows, macOS, Linux
✅ Handles complex CSS/JS without breaking
✅ Transparent backgrounds work correctly
✅ Error messages are helpful and clear

---

## FUTURE ENHANCEMENTS (Post-MVP)

- User accounts and saved presets
- Cloud storage integration (S3, Cloudinary)
- API rate limiting and authentication
- Webhook support for async processing
- Template library with reusable designs
- Browser extension for quick captures
- Docker containerization
- PDF output format
- SVG input support
- Animation/video capture (GIF, MP4)

---

END OF SPECIFICATION
