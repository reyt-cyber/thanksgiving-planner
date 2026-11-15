// Generates the home-screen icons (a pumpkin pie seen from above). Run: node tools/make-icons.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
const crc = buf => { let c = ~0; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return ~c >>> 0; };
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type), data]);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0); body.copy(out, 4); out.writeUInt32BE(crc(body), body.length + 4);
  return out;
};

function icon(size) {
  const layers = [ // radius as a fraction of the icon, colour
    [0.36, [250, 240, 220]], // crust
    [0.29, [201, 118, 46]],  // filling
    [0.085, [255, 250, 240]], // whipped cream
  ];
  const bg = [180, 83, 26];
  const raw = Buffer.alloc(size * (size * 3 + 1));
  const ss = 3; // supersample for smooth edges
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const sum = [0, 0, 0];
      for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
        const dx = (x + (sx + 0.5) / ss) / size - 0.5, dy = (y + (sy + 0.5) / ss) / size - 0.5;
        const r = Math.hypot(dx, dy);
        let c = bg;
        for (const [rad, col] of layers) if (r <= rad) c = col;
        sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2];
      }
      const o = y * (size * 3 + 1) + 1 + x * 3;
      raw[o] = sum[0] / ss / ss; raw[o + 1] = sum[1] / ss / ss; raw[o + 2] = sum[2] / ss / ss;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

const dir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(dir, { recursive: true });
for (const size of [180, 512]) fs.writeFileSync(path.join(dir, `icon-${size}.png`), icon(size));
console.log('icons written to', dir);
