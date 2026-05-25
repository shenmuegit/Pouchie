#!/usr/bin/env node
/**
 * 生成 App 图标（1024×1024）和启动屏（1284×2778）
 * Usage: node generate-assets.js
 */
'use strict';

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

/* ── PNG Encoder ─────────────────────────────────────────────────────────── */

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  CRC_TABLE[i] = c;
}
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0, 0); return b; }
function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  return Buffer.concat([u32(data.length), t, data, u32(crc32(Buffer.concat([t, data])))]);
}

function savePng(filePath, w, h, renderFn) {
  process.stdout.write(`  rendering ${w}×${h}...`);
  const t0     = Date.now();
  const rowLen = 1 + w * 3;
  const raw    = Buffer.allocUnsafe(h * rowLen);
  for (let y = 0; y < h; y++) {
    raw[y * rowLen] = 0; // filter: None
    for (let x = 0; x < w; x++) {
      const col = renderFn(x, y, w, h);
      const off = y * rowLen + 1 + x * 3;
      raw[off]     = col[0] < 0 ? 0 : col[0] > 255 ? 255 : (col[0] + 0.5) | 0;
      raw[off + 1] = col[1] < 0 ? 0 : col[1] > 255 ? 255 : (col[1] + 0.5) | 0;
      raw[off + 2] = col[2] < 0 ? 0 : col[2] > 255 ? 255 : (col[2] + 0.5) | 0;
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });
  const buf = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', Buffer.concat([u32(w), u32(h), Buffer.from([8, 2, 0, 0, 0])])),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
  fs.writeFileSync(filePath, buf);
  console.log(` ✓  ${(buf.length / 1024).toFixed(1)} KB  (${Date.now() - t0}ms)`);
}

/* ── Math Utilities ──────────────────────────────────────────────────────── */

function lerp(a, b, t)  { return a + (b - a) * t; }
function cl01(t)        { return t < 0 ? 0 : t > 1 ? 1 : t; }
function ss(e0, e1, x)  { const t = cl01((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); }

// Signed-distance to axis-aligned rounded rectangle
// (cx,cy): rect center  (hw,hh): half-extents  r: corner radius
function sdfRR(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - hw + r;
  const qy = Math.abs(py - cy) - hh + r;
  return Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2)
       + Math.min(Math.max(qx, qy), 0) - r;
}

// 0→1 alpha for SDF shape (negative = inside), anti-aliased at AA pixels
function shapeA(sdf, AA) { return 1 - ss(-AA, AA, sdf); }
// 0→1 alpha for circle (inside = dist < radius)
function circleA(dist, radius, AA) { return 1 - ss(radius - AA, radius + AA, dist); }

// Parse '#rrggbb' → [r,g,b]
function hex(s) {
  const n = parseInt(s.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ── Icon Renderer (1024×1024) ───────────────────────────────────────────── */

const I_BG1  = hex('#60A5FA'); // top of gradient
const I_BG2  = hex('#2563EB'); // bottom
const I_CL   = hex('#BFDBFE'); // clasp (light blue)
const I_LINE = hex('#C7DEFF'); // card lines

function renderIcon(x, y, w, h) {
  const S  = w / 1024;
  const cx = w / 2, cy = h / 2;
  const AA = 1.5;

  // ── Background gradient ──
  const t = y / h;
  let r = lerp(I_BG1[0], I_BG2[0], t);
  let g = lerp(I_BG1[1], I_BG2[1], t);
  let b = lerp(I_BG1[2], I_BG2[2], t);
  // Soft vignette
  const vx = (x - cx) / cx, vy = (y - cy) / cy;
  const vig = 1 - 0.18 * (vx * vx + vy * vy);
  r *= vig; g *= vig; b *= vig;

  // ── Wallet body ── white rounded rect
  const wCX = cx, wCY = cy + 30 * S, wHW = 270 * S, wHH = 185 * S, wR = 48 * S;
  const wA = shapeA(sdfRR(x, y, wCX, wCY, wHW, wHH, wR), AA) * 0.96;
  r = lerp(r, 255, wA); g = lerp(g, 255, wA); b = lerp(b, 255, wA);

  // ── Wallet flap ── white rounded rect above body
  const fCX = cx, fCY = wCY - wHH * 0.92, fHW = 195 * S, fHH = 82 * S, fR = 32 * S;
  const fA = shapeA(sdfRR(x, y, fCX, fCY, fHW, fHH, fR), AA) * 0.96;
  r = lerp(r, 255, fA); g = lerp(g, 255, fA); b = lerp(b, 255, fA);

  // ── Clasp ── light-blue pill at flap/body junction
  const clA = shapeA(sdfRR(x, y, cx, wCY - wHH + 6 * S, 55 * S, 28 * S, 28 * S), AA);
  r = lerp(r, I_CL[0], clA); g = lerp(g, I_CL[1], clA); b = lerp(b, I_CL[2], clA);

  // ── Card lines inside body ── subtle
  const l1A = shapeA(sdfRR(x, y, cx - 15 * S, wCY - 35 * S, 155 * S, 10 * S, 10 * S), AA) * 0.35;
  r = lerp(r, I_LINE[0], l1A); g = lerp(g, I_LINE[1], l1A); b = lerp(b, I_LINE[2], l1A);
  const l2A = shapeA(sdfRR(x, y, cx - 38 * S, wCY + 28 * S, 100 * S, 10 * S, 10 * S), AA) * 0.35;
  r = lerp(r, I_LINE[0], l2A); g = lerp(g, I_LINE[1], l2A); b = lerp(b, I_LINE[2], l2A);

  return [r, g, b];
}

/* ── Splash Renderer (1284×2778) ─────────────────────────────────────────── */

const S_BG1 = hex('#EDF6FF');
const S_BG2 = hex('#D1E8FF');
const S_BL  = hex('#3B82F6');
const S_CL  = hex('#93C5FD');

function renderSplash(x, y, w, h) {
  const S  = w / 1284;
  const cx = w / 2, cy = h / 2;
  const AA = 1.5;

  // ── Background ──
  const t = y / h;
  let r = lerp(S_BG1[0], S_BG2[0], t * 0.5);
  let g = lerp(S_BG1[1], S_BG2[1], t * 0.5);
  let b = lerp(S_BG1[2], S_BG2[2], t * 0.5);

  // ── Blue disc ──
  const discR  = 200 * S;
  const discCY = cy - 55 * S;
  const dx = x - cx, dy = y - discCY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const dA   = circleA(dist, discR, AA);
  r = lerp(r, S_BL[0], dA); g = lerp(g, S_BL[1], dA); b = lerp(b, S_BL[2], dA);

  // Fade wallet shapes near disc edge
  const inDisc = cl01((discR * 0.92 - dist) / (discR * 0.3));

  // ── Mini wallet body ──
  const wCX = cx, wCY = discCY + 12 * S, wHW = 110 * S, wHH = 75 * S, wR = 18 * S;
  const wA = shapeA(sdfRR(x, y, wCX, wCY, wHW, wHH, wR), AA) * 0.93 * inDisc;
  r = lerp(r, 255, wA); g = lerp(g, 255, wA); b = lerp(b, 255, wA);

  // ── Mini flap ──
  const fA = shapeA(sdfRR(x, y, cx, wCY - wHH * 0.9, 78 * S, 33 * S, 13 * S), AA) * 0.93 * inDisc;
  r = lerp(r, 255, fA); g = lerp(g, 255, fA); b = lerp(b, 255, fA);

  // ── Mini clasp ──
  const cA = shapeA(sdfRR(x, y, cx, wCY - wHH + 3 * S, 22 * S, 11 * S, 11 * S), AA) * inDisc;
  r = lerp(r, S_CL[0], cA); g = lerp(g, S_CL[1], cA); b = lerp(b, S_CL[2], cA);

  return [r, g, b];
}

/* ── Adaptive Icon (Android, 1024×1024) ──────────────────────────────────── */
// Same design as icon but wallet at 58% scale to stay well within the safe zone

function renderAdaptiveIcon(x, y, w, h) {
  const S  = w / 1024 * 0.58; // 58% scale keeps wallet inside ~66% safe zone
  const cx = w / 2, cy = h / 2;
  const AA = 1.5;

  // Background: same blue gradient
  const t = y / h;
  let r = lerp(I_BG1[0], I_BG2[0], t);
  let g = lerp(I_BG1[1], I_BG2[1], t);
  let b = lerp(I_BG1[2], I_BG2[2], t);
  const vx = (x - cx) / cx, vy = (y - cy) / cy;
  const vig = 1 - 0.18 * (vx * vx + vy * vy);
  r *= vig; g *= vig; b *= vig;

  // Wallet body (scaled down)
  const wCX = cx, wCY = cy + 30 * S, wHW = 270 * S, wHH = 185 * S, wR = 48 * S;
  const wA = shapeA(sdfRR(x, y, wCX, wCY, wHW, wHH, wR), AA) * 0.96;
  r = lerp(r, 255, wA); g = lerp(g, 255, wA); b = lerp(b, 255, wA);

  const fCX = cx, fCY = wCY - wHH * 0.92, fHW = 195 * S, fHH = 82 * S, fR = 32 * S;
  const fA = shapeA(sdfRR(x, y, fCX, fCY, fHW, fHH, fR), AA) * 0.96;
  r = lerp(r, 255, fA); g = lerp(g, 255, fA); b = lerp(b, 255, fA);

  const clA = shapeA(sdfRR(x, y, cx, wCY - wHH + 6 * S, 55 * S, 28 * S, 28 * S), AA);
  r = lerp(r, I_CL[0], clA); g = lerp(g, I_CL[1], clA); b = lerp(b, I_CL[2], clA);

  const l1A = shapeA(sdfRR(x, y, cx - 15 * S, wCY - 35 * S, 155 * S, 10 * S, 10 * S), AA) * 0.35;
  r = lerp(r, I_LINE[0], l1A); g = lerp(g, I_LINE[1], l1A); b = lerp(b, I_LINE[2], l1A);
  const l2A = shapeA(sdfRR(x, y, cx - 38 * S, wCY + 28 * S, 100 * S, 10 * S, 10 * S), AA) * 0.35;
  r = lerp(r, I_LINE[0], l2A); g = lerp(g, I_LINE[1], l2A); b = lerp(b, I_LINE[2], l2A);

  return [r, g, b];
}

/* ── Main ────────────────────────────────────────────────────────────────── */

const assetsDir = path.join(__dirname, 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

console.log('icon.png  (1024×1024)');
savePng(path.join(assetsDir, 'icon.png'),           1024, 1024, renderIcon);

console.log('adaptive-icon.png  (1024×1024)');
savePng(path.join(assetsDir, 'adaptive-icon.png'),  1024, 1024, renderAdaptiveIcon);

console.log('splash.png (1284×2778)');
savePng(path.join(assetsDir, 'splash.png'),         1284, 2778, renderSplash);

console.log('\nAssets saved to', assetsDir);
