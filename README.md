# SynthID Remover — Lossless AI Image Watermark & C2PA Metadata Stripper

> **Neutralize invisible high-frequency AI watermarks (SynthID) and strip C2PA Content Credentials provenance manifests from PNG, JPEG, and WebP images. Lossless algorithm (PSNR > 52 dB), zero cloud dependencies, works 100% offline.**

---

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

</div>

---

## 📖 What is SynthID?

**SynthID** is an invisible watermark embedded by AI models into the pixel values of generated images. In parallel, **C2PA** (Coalition for Content Provenance and Authenticity) embeds cryptographic provenance manifests into the binary file headers — including generator tags, timestamps, and signing certificates.

**SynthID Remover** neutralizes both layers completely:

| Layer | What Gets Removed | Technique |
|:---|:---|:---|
| **SynthID Pixel Carrier** | Invisible LSB frequency watermark in pixel values | Anti-phase spatial carrier cancellation |
| **C2PA Manifest (PNG)** | `caBX`, `c2pa`, `eXIf`, `iTXt`, `tEXt` chunks | Binary chunk stripping + CRC-32 rebuild |
| **C2PA Manifest (JPEG)** | `APP11` (JUMBF), `APP1` (EXIF/XMP) markers | Marker segment extraction |
| **C2PA Manifest (WebP)** | RIFF EXIF metadata chunks | RIFF chunk stripping |

---

## 🚀 Quick Start — Get Running in 60 Seconds

### Clone the repository

```bash
git clone https://github.com/Murlikumar99/synthid-remover.git
cd synthid-remover
```

### Install dependencies

```bash
npm install --legacy-peer-deps
```

### Start the web app

```bash
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ All Ways to Run

### Method 1: Python 3 CLI — Zero Setup, No pip Required

Uses only Python standard library (`zlib`, `struct`, `math`):

```bash
# Syntax:
python scripts/remove_synthid.py <input_image> <output_image>

# Examples:
python scripts/remove_synthid.py "input_image.png" "clean_image.png"
python scripts/remove_synthid.py "photo.jpg" "photo_clean.jpg"
python scripts/remove_synthid.py "artwork.webp" "artwork_clean.webp"
```

**JSON stdio mode (for automation/scripts):**
```bash
python scripts/remove_synthid.py --stdin-json <<EOF
{"base64Data": "...base64 encoded image bytes..."}
EOF
```

---

### Method 2: Node.js CLI

Uses only Node.js built-ins (`node:fs`, `node:zlib`, `node:crypto`):

```bash
# Syntax:
node scripts/remove_synthid.mjs <input_image> <output_image>

# Examples:
node scripts/remove_synthid.mjs "artwork.png" "artwork_clean.png"
node scripts/remove_synthid.mjs "photo.jpg" "photo_clean.jpg"
```

---

### Method 3: Local Web Server (Full Interactive UI)

```bash
# After cloning and installing:
npm run dev

# Or run the backend server directly with TypeScript support:
node node_modules/tsx/dist/cli.mjs server.ts
```

**Server starts at:** `http://localhost:3000`

Features of the web UI:
- 🖱️ Drag-and-drop file upload (PNG, JPEG, WebP)
- 🔍 Real-time laser pixel scan visualization
- 📊 Telemetry: format, bytes removed, PSNR, modified pixel count
- 🔐 HMAC-SHA256 cryptographic verification receipt
- 💾 One-click clean image download
- 🧪 Load sample AI image for testing

---

### Method 4: Standalone HTML Tool (No Server or Install Required)

A completely self-contained, single-file tool that runs in any browser — no server, no install, no network:

```bash
# After cloning, just open this file in any browser:
open synthid_remover_standalone.html

# Or on Android:
# Navigate to the file and tap to open in Chrome/Firefox
```

All processing runs client-side via HTML5 Canvas API and `Uint8Array` binary parsing.

---

## 📸 Supported Formats

| Format | C2PA Binary Strip | SynthID Pixel Neutralization | Full Resolution |
|:---:|:---:|:---:|:---:|
| **PNG** | ✅ | ✅ | ✅ Up to 4K+ |
| **JPEG / JPG** | ✅ | ✅ | ✅ Up to 4K+ |
| **WebP** | ✅ | ✅ | ✅ Up to 4K+ |

---

## 🧪 Run Tests

```bash
npm test
```

Expected output:
```
✔ neutralizeSynthIdPixelBuffer — PSNR 52.9 dB (visually lossless)
✔ analyzePixelCarrierSignature — carrier suppression verified
✔ inspectAndStripBinaryMedia — PNG caBX, eXIf chunk stripping
✔ inspectAndStripBinaryMedia — JPEG APP11 C2PA stripping
✔ nodePngSynthIdEngine — lossless IDAT scanline reconstruction
✔ ... (12/12 tests passing)
```

---

## 📁 Project Structure

```
synthid-remover/
├── README.md                          # This file
├── package.json                       # Node.js dependencies
├── server.ts                          # Express + Vite dev server
├── vite.config.ts                     # Vite bundler config
├── tsconfig.json                      # TypeScript config
├── scripts/
│   ├── remove_synthid.py              # Python 3 standalone CLI
│   └── remove_synthid.mjs             # Node.js standalone CLI
└── src/
    ├── main.tsx                       # React app entry
    ├── App.tsx                        # Root component
    ├── components/
    │   └── SynthIdToolWorkspace.tsx   # Main UI workspace
    └── utils/
        ├── synthIdEngine.ts           # Pixel carrier neutralizer + PSNR
        ├── binaryMediaEngine.ts       # PNG/JPEG/WebP binary parser
        ├── nodePngSynthIdEngine.ts    # Node.js IDAT deflate re-encoder
        └── synthIdEngine.test.ts      # Test suite
```

---

## ⚙️ Algorithm Details

### Stage 1: Binary Container Stripping
Physically parses the raw image bitstream — no re-encoding, no quality loss:
- **PNG**: Reads each chunk header, strips provenance chunks by type code, recalculates IEEE 802.3 CRC-32 for the remaining chunks
- **JPEG**: Walks marker segments, removes `APP11` (JUMBF C2PA) and `APP1` (EXIF/XMP) markers
- **WebP**: Strips RIFF `EXIF` and C2PA metadata chunks

### Stage 2: Pixel Carrier Neutralization
Targets the invisible LSB frequency watermark embedded in pixel RGB values:
```
Phase shift = ((7x + 13y) mod 3) − 1   →  {-1, 0, +1}
Target LSB  = phase > 0 ? 1 : 0
New pixel   = (original & 0xFE) | target_LSB
```
Result: **PSNR > 52.0 dB** — imperceptible difference from the original.

### Stage 3: CNN Block Boundary Desynchronization
Applies boundary jitter on 8×8 convolution block edges to prevent patch-based watermark correlation:
```
Boundary jitter = ((11x + 17y) mod 3) − 1   →  {-1, 0, +1}
```

---

## 🔒 Privacy & Security

- ✅ **100% offline** — no image bytes ever leave your device
- ✅ **No external API calls** for core processing
- ✅ Local server uses per-session rate limiting and strict CORS validation
- ✅ All file processing is in-memory — no temporary files written to disk

---

## 📄 License

MIT License — free to use, modify, and distribute.
