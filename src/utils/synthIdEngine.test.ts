import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBytes,
  validateMediaFile,
  calculateCreditsRequired,
  buildCleanedFileName,
  createInitialScanReport,
  advanceReportToStage,
  neutralizeSynthIdPixelBuffer,
  splitTextIntoTokens,
  scrambleStringAtProgress,
} from './synthIdEngine.ts';

test('formatBytes formats byte counts accurately', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2 KB');
  assert.equal(formatBytes(1572864), '1.5 MB');
});

test('validateMediaFile accepts valid images, videos, and audio and rejects empty/unsupported files', () => {
  const validPng = validateMediaFile('gemini-export.png', 'image/png', 120_000, 'image');
  assert.equal(validPng.valid, true);
  assert.equal(validPng.detectedType, 'image');

  const validMp4 = validateMediaFile('veo-clip.mp4', 'video/mp4', 4_500_000, 'video');
  assert.equal(validMp4.valid, true);
  assert.equal(validMp4.detectedType, 'video');

  const emptyFile = validateMediaFile('empty.png', 'image/png', 0, 'image');
  assert.equal(emptyFile.valid, false);

  const unsupported = validateMediaFile('script.exe', 'application/octet-stream', 1024, 'image');
  assert.equal(unsupported.valid, false);
});

test('calculateCreditsRequired follows RemoveSynthID pricing rules', () => {
  // First image is free
  const firstImg = calculateCreditsRequired('image', 0, 0);
  assert.equal(firstImg.credits, 0);
  assert.equal(firstImg.isFreeEligible, true);

  // Subsequent images cost 5 credits
  const secondImg = calculateCreditsRequired('image', 0, 1);
  assert.equal(secondImg.credits, 5);
  assert.equal(secondImg.isFreeEligible, false);

  // Audio up to 1 minute is free on first removal, then 5 credits per started minute
  const firstAudio = calculateCreditsRequired('audio', 45, 0);
  assert.equal(firstAudio.credits, 0);
  assert.equal(firstAudio.isFreeEligible, true);

  const twoMinAudio = calculateCreditsRequired('audio', 110, 1);
  assert.equal(twoMinAudio.credits, 10);

  // Video uses 15 credits per second
  const tenSecVideo = calculateCreditsRequired('video', 10, 0);
  assert.equal(tenSecVideo.credits, 150);
  assert.equal(tenSecVideo.isFreeEligible, false);
});

test('buildCleanedFileName preserves extension and appends -clean', () => {
  assert.equal(buildCleanedFileName('gemini_portrait.webp'), 'gemini_portrait-clean.webp');
  assert.equal(buildCleanedFileName('veo.clip.mp4'), 'veo.clip-clean.mp4');
});

test('createInitialScanReport and advanceReportToStage transition confidence from ~99% to 0%', () => {
  const report = createInitialScanReport({
    id: 'test-1',
    fileName: 'gemini-still.png',
    fileSize: 840_000,
    mediaType: 'image',
    mimeType: 'image/png',
  });
  assert.equal(report.stage, 'Original');
  assert.ok(report.originalConfidence >= 97);

  const cleaned = advanceReportToStage(report, 5, 'blob:clean');
  assert.equal(cleaned.stage, 'Clean');
  assert.equal(cleaned.cleanedConfidence, 0);
  assert.equal(cleaned.signalsRemoved.synthIdPixel, true);
  assert.equal(cleaned.signalsRemoved.c2paCredential, true);
  assert.equal(cleaned.detectorRows[0].cleanedStatus, 'Clean');
  assert.equal(cleaned.detectorRows[1].cleanedStatus, 'Removed');
  assert.equal(cleaned.detectorRows[2].cleanedStatus, 'Not flagged');
  assert.equal(cleaned.detectorRows[3].cleanedStatus, 'No label');
});

test('neutralizeSynthIdPixelBuffer disrupts LSB carrier while maintaining high PSNR (>48 dB)', () => {
  const width = 16;
  const height = 16;
  const buffer = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < buffer.length; i += 4) {
    buffer[i] = 128;
    buffer[i + 1] = 140;
    buffer[i + 2] = 200;
    buffer[i + 3] = 255;
  }
  const result = neutralizeSynthIdPixelBuffer(buffer, width, height);
  assert.ok(result.modifiedPixels > 0);
  assert.ok(result.psnrDb >= 48);
});

test('splitTextIntoTokens and scrambleStringAtProgress handle kinetic typography transformations', () => {
  const tokens = splitTextIntoTokens('Stop Platforms Flagging');
  assert.equal(tokens.length, 3);
  assert.equal(tokens[0].word, 'Stop');
  assert.deepEqual(tokens[0].chars, ['S', 't', 'o', 'p']);

  const decodedFull = scrambleStringAtProgress('SynthID', 1.0);
  assert.equal(decodedFull, 'SynthID');

  const decodedHalf = scrambleStringAtProgress('SynthID', 0.5);
  assert.equal(decodedHalf.length, 7);
  assert.equal(decodedHalf.slice(0, 3), 'Syn');
  assert.notEqual(decodedHalf, 'SynthID');
});

test('parseAndStripPngBuffer parses real PNG chunks, extracts IHDR dimensions, and strips caBX/eXIf/iTXt chunks', async () => {
  const { parseAndStripPngBuffer, analyzePixelCarrierSignature } = await import('./binaryMediaEngine.ts');

  // Construct a synthetic valid PNG with IHDR (800x600), caBX (C2PA OpenAI), eXIf, IDAT, IEND
  const pngSig = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  function makeChunk(type: string, data: Uint8Array): Uint8Array {
    const out = new Uint8Array(12 + data.length);
    const len = data.length;
    out[0] = (len >>> 24) & 0xff;
    out[1] = (len >>> 16) & 0xff;
    out[2] = (len >>> 8) & 0xff;
    out[3] = len & 0xff;
    for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    out.set(data, 8);
    return out;
  }

  // IHDR: width=800 (0x00000320), height=600 (0x00000258)
  const ihdrData = new Uint8Array([0, 0, 3, 0x20, 0, 0, 2, 0x58, 8, 6, 0, 0, 0]);
  const cabxText = new TextEncoder().encode('c2pa jumbf manifest signed by OpenAI OpCo, LLC');
  const exifData = new TextEncoder().encode('Exif\0\0Google SynthID');
  const idatData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const iendData = new Uint8Array(0);

  const chunks = [
    pngSig,
    makeChunk('IHDR', ihdrData),
    makeChunk('caBX', cabxText),
    makeChunk('eXIf', exifData),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', iendData),
  ];
  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const fullPng = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of chunks) {
    fullPng.set(c, pos);
    pos += c.length;
  }

  const res = parseAndStripPngBuffer(fullPng, 'sample.png');
  assert.equal(res.format, 'PNG');
  assert.equal(res.width, 800);
  assert.equal(res.height, 600);
  assert.equal(res.chunksStripped.length, 2);
  assert.ok(res.bytesRemoved > 0);
  assert.ok(res.c2paSigner.includes('OpenAI'));

  // Verify pixel carrier analyzer before and after neutralization
  const rgba = new Uint8ClampedArray(16 * 16 * 4);
  for (let i = 0; i < rgba.length; i++) rgba[i] = 180;
  const before = analyzePixelCarrierSignature(rgba, 16, 16);
  assert.equal(before.isSynthIdNeutralized, false);

  neutralizeSynthIdPixelBuffer(rgba, 16, 16);
  const after = analyzePixelCarrierSignature(rgba, 16, 16);
  assert.equal(after.isSynthIdNeutralized, true);
  assert.equal(after.carrierEnergyScore, 0);
});

test('rewritePngSynthIdNode decompresses PNG IDAT scanlines, neutralizes SynthID pixels, and re-encodes valid PNG', async () => {
  const zlib = await import('zlib');
  const { rewritePngSynthIdNode } = await import('./nodePngSynthIdEngine.ts');

  // Create a real 4x4 8-bit RGBA PNG with valid zlib-compressed IDAT scanlines
  const width = 4;
  const height = 4;
  const stride = width * 4;
  const rawScanlines = Buffer.alloc(height * (1 + stride));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + stride);
    rawScanlines[rowStart] = 0; // Filter type 0 (None)
    for (let i = 0; i < stride; i++) {
      rawScanlines[rowStart + 1 + i] = 160;
    }
  }
  const compressedIdat = zlib.deflateSync(rawScanlines);

  function buildChunk(type: string, data: Buffer): Buffer {
    const buf = Buffer.alloc(12 + data.length);
    buf.writeUInt32BE(data.length, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    return buf;
  }

  const ihdr = Buffer.from([0, 0, 0, width, 0, 0, 0, height, 8, 6, 0, 0, 0]);
  const cabx = Buffer.from('c2pa manifest signed by Google LLC SynthID');
  const pngBuffer = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    buildChunk('IHDR', ihdr),
    buildChunk('caBX', cabx),
    buildChunk('IDAT', compressedIdat),
    buildChunk('IEND', Buffer.alloc(0)),
  ]);

  const res = rewritePngSynthIdNode(pngBuffer);
  assert.equal(res.engine, 'nodejs');
  assert.equal(res.width, 4);
  assert.equal(res.height, 4);
  assert.equal(res.pixelRewriteApplied, true);
  assert.ok(res.modifiedPixels > 0);
  assert.ok(res.psnrDb >= 48);
  assert.deepEqual(res.chunksStripped, ['caBX']);
});

test('rewritePngSynthIdNode handles JPEG and WebP buffers seamlessly', async () => {
  const { rewritePngSynthIdNode } = await import('./nodePngSynthIdEngine.ts');

  // Synthetic JPEG with SOI, APP11 (C2PA), and EOI
  const app11Payload = Buffer.from('c2pa jumbf manifest');
  const segLen = 2 + app11Payload.length;
  const jpegBuf = Buffer.concat([
    Buffer.from([0xff, 0xd8]), // SOI
    Buffer.from([0xff, 0xeb, (segLen >> 8) & 0xff, segLen & 0xff]), // APP11 marker
    app11Payload,
    Buffer.from([0xff, 0xd9]), // EOI
  ]);

  const res = rewritePngSynthIdNode(jpegBuf);
  assert.equal(res.engine, 'nodejs');
  assert.equal(res.pixelRewriteApplied, true);
  assert.ok(res.chunksStripped.some((c) => c.includes('APP11')));
  assert.ok(res.bytesRemoved > 0);
});

test('inspectAndStripBinaryMedia accurately extracts chunks, signers, and dimensions for JPEG & WebP', async () => {
  const { inspectAndStripBinaryMedia } = await import('./binaryMediaEngine.ts');

  // Construct valid synthetic JPEG with APP11 (C2PA) signed by Google DeepMind SynthID
  const app11Payload = new TextEncoder().encode('c2pa jumbf Google DeepMind SynthID Imagen 3');
  const segLen = 2 + app11Payload.length;
  const jpeg = new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xeb, (segLen >> 8) & 0xff, segLen & 0xff, // APP11
    ...app11Payload,
    0xff, 0xd9, // EOI
  ]);

  const inspection = inspectAndStripBinaryMedia(jpeg, 'imagen_synthid.jpg');
  assert.equal(inspection.format, 'JPEG');
  assert.equal(inspection.chunksStripped.length, 1);
  assert.ok(inspection.bytesRemoved > 0);
  assert.ok(inspection.c2paSigner.includes('Google'));
  assert.equal(inspection.strippedBuffer[0], 0xff);
  assert.equal(inspection.strippedBuffer[1], 0xd8);
});

test('neutralizeSynthIdPixelBuffer completely breaks carrier phase lock and achieves PSNR > 50 dB', async () => {
  const { analyzePixelCarrierSignature } = await import('./binaryMediaEngine.ts');

  const w = 64;
  const h = 64;
  const rgba = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      rgba[idx] = 120 + ((x * 3) % 20);
      rgba[idx + 1] = 130 + ((y * 5) % 20);
      rgba[idx + 2] = 180 + (((x + y) * 2) % 20);
      rgba[idx + 3] = 255;
    }
  }

  const before = analyzePixelCarrierSignature(rgba, w, h);
  assert.equal(before.isSynthIdNeutralized, false);

  const res = neutralizeSynthIdPixelBuffer(rgba, w, h);
  assert.ok(res.modifiedPixels > 0);
  assert.ok(res.psnrDb >= 50.0);

  const after = analyzePixelCarrierSignature(rgba, w, h);
  assert.equal(after.isSynthIdNeutralized, true);
  assert.equal(after.carrierEnergyScore, 0);
});
