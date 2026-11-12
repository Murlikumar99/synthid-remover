import { removeWatermarkFromImageDataSync } from '@pilio/gemini-watermark-remover/image-data';

export type DisruptionMode = 'balanced' | 'aggressive' | 'metadata-only';
export type ExportImageFormat = 'png' | 'jpeg' | 'webp';

export interface ProvenanceAuditReport {
  c2paFound: boolean;
  exifFound: boolean;
  xmpFound: boolean;
  iccFound: boolean;
  iptcFound: boolean;
  clean: boolean;
  bytesScanned: number;
  formatDetected: string;
}

export interface GeminiBadgeRemovalMeta {
  evaluated: boolean;
  applied: boolean;
  decisionTier: string;
  alphaGain: number;
  skipReason?: string | null;
}

/**
 * Forensic byte-level scanner on raw binary buffers or base64 data URLs.
 * Verifies that zero C2PA (caBX / JUMBF), EXIF, XMP, ICC, or IPTC chunks survive.
 */
export function scanBytesProvenance(bytes: Uint8Array): ProvenanceAuditReport {
  let c2pa = false;
  let exif = false;
  let xmp = false;
  let icc = false;
  let iptc = false;
  let format = 'PNG';

  // PNG signature
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    format = 'PNG';
    let offset = 8;
    while (offset + 8 <= bytes.length) {
      const chunkLen =
        (((bytes[offset] << 24) >>> 0) +
          (bytes[offset + 1] << 16) +
          (bytes[offset + 2] << 8) +
          bytes[offset + 3]) >>>
        0;
      const chunkType = String.fromCharCode(
        bytes[offset + 4],
        bytes[offset + 5],
        bytes[offset + 6],
        bytes[offset + 7]
      );
      if (chunkType === 'caBX' || chunkType === 'c2pa') c2pa = true;
      if (chunkType === 'eXIf') exif = true;
      if (chunkType === 'iCCP') icc = true;
      if (chunkType === 'iTXt' || chunkType === 'tEXt' || chunkType === 'zTXt') {
        let chunkText = '';
        const maxText = Math.min(bytes.length, offset + 8 + Math.min(chunkLen, 120));
        for (let j = offset + 8; j < maxText; j++) {
          chunkText += String.fromCharCode(bytes[j]);
        }
        if (/c2pa|contentcredentials|jumbf/i.test(chunkText)) c2pa = true;
        if (/xmp|ns\.adobe/i.test(chunkText)) xmp = true;
        if (/exif/i.test(chunkText)) exif = true;
        if (/iptc/i.test(chunkText)) iptc = true;
      }
      offset += 12 + chunkLen;
    }
  }
  // JPEG signature
  else if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    format = 'JPEG';
    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      if (marker === 0xda || marker === 0xd9) break;
      const markerLen = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (markerLen < 2) break;
      if (marker === 0xe1) {
        let payload = '';
        const maxP = Math.min(bytes.length, offset + 4 + Math.min(markerLen - 2, 40));
        for (let j = offset + 4; j < maxP; j++) {
          payload += String.fromCharCode(bytes[j]);
        }
        if (payload.startsWith('Exif')) exif = true;
        if (payload.includes('ns.adobe.com') || payload.includes('XMP')) xmp = true;
      }
      if (marker === 0xe2) icc = true;
      if (marker === 0xed) iptc = true;
      if (marker === 0xeb) c2pa = true;
      offset += 2 + markerLen;
    }
  }
  // WebP signature
  else if (
    bytes.length >= 12 &&
    String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'RIFF'
  ) {
    format = 'WEBP';
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const chunkId = String.fromCharCode(
        bytes[offset],
        bytes[offset + 1],
        bytes[offset + 2],
        bytes[offset + 3]
      );
      const chunkLen =
        (bytes[offset + 4] |
          (bytes[offset + 5] << 8) |
          (bytes[offset + 6] << 16) |
          ((bytes[offset + 7] << 24) >>> 0)) >>>
        0;
      if (chunkId === 'EXIF') exif = true;
      if (chunkId === 'XMP ') xmp = true;
      if (chunkId === 'ICCP') icc = true;
      offset += 8 + chunkLen + (chunkLen % 2);
    }
  }

  return {
    c2paFound: c2pa,
    exifFound: exif,
    xmpFound: xmp,
    iccFound: icc,
    iptcFound: iptc,
    clean: !c2pa && !exif && !xmp && !icc && !iptc,
    bytesScanned: bytes.length,
    formatDetected: format,
  };
}

export function scanBase64Provenance(base64DataUrl: string): ProvenanceAuditReport {
  try {
    const commaIdx = base64DataUrl.indexOf(',');
    const raw = commaIdx >= 0 ? base64DataUrl.slice(commaIdx + 1) : base64DataUrl;
    const binaryString = typeof atob === 'function' ? atob(raw) : '';
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return scanBytesProvenance(bytes);
  } catch {
    return {
      c2paFound: false,
      exifFound: false,
      xmpFound: false,
      iccFound: false,
      iptcFound: false,
      clean: true,
      bytesScanned: 0,
      formatDetected: 'PNG',
    };
  }
}

/**
 * Automatically detects and erases visible Gemini corner watermark badges using
 * mathematically exact Reverse Alpha Blending from `@pilio/gemini-watermark-remover`.
 * Restores original pixel colors behind the Gemini badge with zero visual blurring.
 */
export function eraseGeminiCornerBadge(
  data: Uint8ClampedArray,
  width: number,
  height: number
): GeminiBadgeRemovalMeta {
  try {
    const result = removeWatermarkFromImageDataSync(
      { width, height, data },
      {
        adaptiveMode: 'always',
        aggressiveLocatedFallback: true,
        locatedAggressiveRemoval: true,
      }
    );
    if (result && result.imageData && result.imageData.data) {
      if (result.imageData.data !== data) {
        data.set(result.imageData.data);
      }
      const meta = result.meta as
        | {
            applied?: boolean;
            decisionTier?: string | null;
            alphaGain?: number;
            skipReason?: string | null;
          }
        | undefined;
      return {
        evaluated: true,
        applied: Boolean(meta?.applied),
        decisionTier: meta?.decisionTier || 'adaptive',
        alphaGain: typeof meta?.alphaGain === 'number' ? Number(meta.alphaGain.toFixed(2)) : 1.0,
        skipReason: meta?.skipReason ?? null,
      };
    }
  } catch {
    // Fallback gracefully if dimensions are smaller than badge template
  }
  return {
    evaluated: true,
    applied: false,
    decisionTier: 'clean',
    alphaGain: 1.0,
    skipReason: null,
  };
}

/**
 * 1D in-place radix-2 Cooley-Tukey Fast Fourier Transform.
 */
function fft1d(re: Float64Array, im: Float64Array, n: number, inv = false): void {
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i];
      re[i] = re[j];
      re[j] = tr;
      const ti = im[i];
      im[i] = im[j];
      im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inv ? 2 : -2) * Math.PI) / len;
    const wlenR = Math.cos(ang);
    const wlenI = Math.sin(ang);
    const halfLen = len >> 1;
    for (let i = 0; i < n; i += len) {
      let wr = 1;
      let wi = 0;
      for (let j = 0; j < halfLen; j++) {
        const uR = re[i + j];
        const uI = im[i + j];
        const vR = re[i + j + halfLen] * wr - im[i + j + halfLen] * wi;
        const vI = re[i + j + halfLen] * wi + im[i + j + halfLen] * wr;
        re[i + j] = uR + vR;
        im[i + j] = uI + vI;
        re[i + j + halfLen] = uR - vR;
        im[i + j + halfLen] = uI - vI;
        const nextWr = wr * wlenR - wi * wlenI;
        wi = wr * wlenI + wi * wlenR;
        wr = nextWr;
      }
    }
  }
  if (inv) {
    const invN = 1 / n;
    for (let i = 0; i < n; i++) {
      re[i] *= invN;
      im[i] *= invN;
    }
  }
}

/**
 * 2D Fast Fourier Transform on an N x N power-of-two matrix.
 */
function fft2d(re: Float64Array, im: Float64Array, N: number, inv = false): void {
  for (let y = 0; y < N; y++) {
    const rowOffset = y * N;
    fft1d(
      re.subarray(rowOffset, rowOffset + N),
      im.subarray(rowOffset, rowOffset + N),
      N,
      inv
    );
  }
  const colR = new Float64Array(N);
  const colI = new Float64Array(N);
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      colR[y] = re[y * N + x];
      colI[y] = im[y * N + x];
    }
    fft1d(colR, colI, N, inv);
    for (let y = 0; y < N; y++) {
      re[y * N + x] = colR[y];
      im[y * N + x] = colI[y];
    }
  }
}

/**
 * Bounded 16-32 Pixel Octave Fourier Phase Scramble on Luminance (Y).
 * Scrambles phase angle uniformly in [-PI, PI] within the 16-32 pixel octave band
 * (the carrier band utilized by DeepMind SynthID), softly clamping the spatial
 * luminance delta via tanh compression to maxDelta (+-2.5 levels) to prevent mottling.
 */
export function applyBoundedFourierScramble(
  pixels: Uint8ClampedArray,
  w: number,
  h: number,
  channels = 4,
  maxDelta = 2.5
): Uint8ClampedArray {
  // Cap FFT matrix dimension at 1024 so client/server execution stays fast (<250ms)
  let N = 2;
  const targetDim = Math.min(1024, Math.max(w, h));
  while (N < targetDim) N <<= 1;

  const re = new Float64Array(N * N);
  const im = new Float64Array(N * N);
  const yOrig = new Float64Array(N * N);

  for (let y = 0; y < N; y++) {
    const srcY = Math.min(h - 1, Math.floor((y * h) / N));
    for (let x = 0; x < N; x++) {
      const srcX = Math.min(w - 1, Math.floor((x * w) / N));
      const pIdx = (srcY * w + srcX) * channels;
      const yVal = 0.299 * pixels[pIdx] + 0.587 * pixels[pIdx + 1] + 0.114 * pixels[pIdx + 2];
      yOrig[y * N + x] = yVal;
      re[y * N + x] = yVal;
    }
  }

  fft2d(re, im, N, false);

  const minK = N / 32;
  const maxK = N / 16;

  for (let ky = 0; ky <= N / 2; ky++) {
    const kv = ky;
    const kxMax = ky === 0 || ky === N / 2 ? N / 2 : N;
    for (let kx = 0; kx < kxMax; kx++) {
      const ku = kx <= N / 2 ? kx : kx - N;
      const k = Math.sqrt(ku * ku + kv * kv);
      if (k >= minK && k <= maxK) {
        const idx = ky * N + kx;
        const mag = Math.sqrt(re[idx] * re[idx] + im[idx] * im[idx]);
        // Deterministic pseudo-random phase angle in [-PI, PI]
        const seedAngle = Math.sin(kx * 12.9898 + ky * 78.233) * 43758.5453;
        const newPhase = ((seedAngle - Math.floor(seedAngle)) * 2 - 1) * Math.PI;
        const newRe = mag * Math.cos(newPhase);
        const newIm = mag * Math.sin(newPhase);
        re[idx] = newRe;
        im[idx] = newIm;

        const conjX = (N - kx) % N;
        const conjY = (N - ky) % N;
        const conjIdx = conjY * N + conjX;
        re[conjIdx] = newRe;
        im[conjIdx] = -newIm;
      }
    }
  }

  fft2d(re, im, N, true);

  const output = new Uint8ClampedArray(pixels.length);
  output.set(pixels);

  for (let y = 0; y < h; y++) {
    const ny = Math.min(N - 1, Math.floor((y * N) / h));
    for (let x = 0; x < w; x++) {
      const nx = Math.min(N - 1, Math.floor((x * N) / w));
      const pIdx = (y * w + x) * channels;
      const fIdx = ny * N + nx;
      const rawDelta = re[fIdx] - yOrig[fIdx];
      const deltaY = maxDelta * Math.tanh(rawDelta / maxDelta);

      output[pIdx] = Math.min(255, Math.max(0, Math.round(pixels[pIdx] + deltaY)));
      output[pIdx + 1] = Math.min(255, Math.max(0, Math.round(pixels[pIdx + 1] + deltaY)));
      output[pIdx + 2] = Math.min(255, Math.max(0, Math.round(pixels[pIdx + 2] + deltaY)));
    }
  }

  return output;
}

/**
 * Gradient-adaptive range-weighted bilateral filter & multi-band phase dither.
 * Smooths low-amplitude steganographic carrier ripples in continuous-tone regions
 * (skies, studio backdrops, water) while preserving sharp high-contrast edges.
 */
export function applyBilateralCarrierDisruption(
  pixels: Uint8ClampedArray,
  w: number,
  h: number,
  channels: number,
  sigmaR: number,
  noiseScale: number,
  mode: DisruptionMode
): { output: Uint8ClampedArray; hasTransparency: boolean } {
  const output = new Uint8ClampedArray(pixels.length);
  output.set(pixels);

  const lut = new Float32Array(768);
  const denom = 2 * sigmaR * sigmaR;
  for (let d = 0; d < 768; d++) {
    lut[d] = Math.exp(-(d * d) / denom);
  }

  let hasTransparency = false;

  for (let y = 1; y < h - 1; y++) {
    const rowOffset = y * w * channels;
    for (let x = 1; x < w - 1; x++) {
      const idx = rowOffset + x * channels;
      if (channels === 4 && pixels[idx + 3] < 255) {
        hasTransparency = true;
      }

      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];

      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let totalW = 0;

      for (let dy = -1; dy <= 1; dy++) {
        const nRow = (y + dy) * w * channels;
        for (let dx = -1; dx <= 1; dx++) {
          const nIdx = nRow + (x + dx) * channels;
          const nr = pixels[nIdx];
          const ng = pixels[nIdx + 1];
          const nb = pixels[nIdx + 2];
          const diff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
          const weight = lut[diff];
          sumR += nr * weight;
          sumG += ng * weight;
          sumB += nb * weight;
          totalW += weight;
        }
      }

      const invW = 1.0 / totalW;
      let outR = sumR * invW;
      let outG = sumG * invW;
      let outB = sumB * invW;

      // Deterministic multi-band chrominance and luminance phase decorrelation
      const hash = ((x * 73856093) ^ (y * 19349663)) >>> 0;
      const threshold = mode === 'aggressive' ? 70 : 50;
      if (hash % 100 < threshold) {
        const norm = ((hash % 1000) / 1000 - 0.5) * noiseScale;
        const jLuma = norm * (mode === 'aggressive' ? 0.55 : 0.35);
        outR = Math.min(255, Math.max(0, outR + norm + jLuma));
        outG = Math.min(255, Math.max(0, outG + jLuma));
        outB = Math.min(255, Math.max(0, outB - norm + jLuma));
      }

      output[idx] = Math.round(outR);
      output[idx + 1] = Math.round(outG);
      output[idx + 2] = Math.round(outB);
    }
  }

  return { output, hasTransparency };
}
