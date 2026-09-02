#!/usr/bin/env node
/*
 * Genera los íconos de la PWA (icons/*.png) sin dependencias: dibuja una espada
 * en diagonal sobre fondo oscuro y codifica el PNG a mano (zlib viene con Node).
 *
 * Uso: npm run build:icons
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.resolve(__dirname, '..', 'icons');

// Paleta (misma que styles.css)
const BG = [0x1b, 0x16, 0x13];
const BLADE = [0xef, 0xe6, 0xd8];
const GOLD = [0xe0, 0xa0, 0x3a];
const DARK = [0x2e, 0x26, 0x20];

// ---------- PNG mínimo ----------
const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
    }
    return t;
})();
function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
}
function encodePNG(size, rgba) {
    const raw = Buffer.alloc((size * 4 + 1) * size);
    for (let y = 0; y < size; y++) {
        raw[y * (size * 4 + 1)] = 0; // filtro: none
        rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
    ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8 bits, RGBA
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
        chunk('IEND', Buffer.alloc(0))
    ]);
}

// ---------- Geometría ----------
// Distancia de un punto a un segmento
function distSeg(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay, wx = px - ax, wy = py - ay;
    const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
    const dx = ax + t * vx - px, dy = ay + t * vy - py;
    return Math.hypot(dx, dy);
}
// Cobertura suavizada (anti-aliasing) de un trazo de grosor w
const cover = (d, w) => Math.max(0, Math.min(1, w / 2 - d + 0.5));
function blend(dst, src, a) {
    for (let i = 0; i < 3; i++) dst[i] = Math.round(dst[i] * (1 - a) + src[i] * a);
}

/**
 * Dibuja el ícono. maskable=true rellena todo el lienzo (Android recorta a su forma);
 * false deja transparente fuera de un cuadrado redondeado.
 */
function drawIcon(size, maskable) {
    const px = Buffer.alloc(size * size * 4);
    const u = size / 100; // unidades relativas
    const radius = 22 * u;
    const pad = maskable ? 10 * u : 0; // zona segura del maskable: 80% central

    // Espada en diagonal (de abajo-izquierda a arriba-derecha)
    const s = maskable ? 0.8 : 1;
    const cx = size / 2, cy = size / 2;
    const P = (x, y) => [cx + (x - 50) * u * s, cy + (y - 50) * u * s];
    const [tipX, tipY] = P(78, 22);      // punta
    const [gX, gY] = P(38, 62);          // cruz (guarda)
    const [pomX, pomY] = P(24, 76);      // pomo
    const dirX = (tipX - pomX), dirY = (tipY - pomY);
    const len = Math.hypot(dirX, dirY);
    const nx = -dirY / len, ny = dirX / len; // perpendicular
    const guardHalf = 11 * u * s;
    const [g1x, g1y] = [gX + nx * guardHalf, gY + ny * guardHalf];
    const [g2x, g2y] = [gX - nx * guardHalf, gY - ny * guardHalf];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            const fx = x + 0.5, fy = y + 0.5;

            // Fondo: cuadrado redondeado (o todo, si es maskable)
            let alpha = 1;
            if (!maskable) {
                const qx = Math.max(Math.abs(fx - cx) - (size / 2 - radius), 0);
                const qy = Math.max(Math.abs(fy - cy) - (size / 2 - radius), 0);
                alpha = Math.max(0, Math.min(1, radius - Math.hypot(qx, qy) + 0.5));
            }
            if (alpha <= 0) continue;

            // Degradé sutil del fondo
            const g = (fx + fy) / (2 * size);
            const col = [
                Math.round(BG[0] + (DARK[0] - BG[0]) * g),
                Math.round(BG[1] + (DARK[1] - BG[1]) * g),
                Math.round(BG[2] + (DARK[2] - BG[2]) * g)
            ];

            // Hoja (clara), con grosor que se afina hacia la punta
            const dBlade = distSeg(fx, fy, gX, gY, tipX, tipY);
            const tBlade = Math.max(0, Math.min(1, ((fx - gX) * dirX + (fy - gY) * dirY) / (len * len)));
            const bladeW = (9 - 6 * tBlade) * u * s;
            blend(col, BLADE, cover(dBlade, bladeW));

            // Guarda y empuñadura (dorado)
            blend(col, GOLD, cover(distSeg(fx, fy, g1x, g1y, g2x, g2y), 5 * u * s));
            blend(col, GOLD, cover(distSeg(fx, fy, gX, gY, pomX, pomY), 5.5 * u * s));
            blend(col, GOLD, cover(Math.hypot(fx - pomX, fy - pomY) - 3.5 * u * s, 3 * u * s));

            px[i] = col[0]; px[i + 1] = col[1]; px[i + 2] = col[2]; px[i + 3] = Math.round(alpha * 255);
        }
    }
    void pad;
    return px;
}

fs.mkdirSync(OUT, { recursive: true });
const targets = [
    ['icon-192.png', 192, false],
    ['icon-512.png', 512, false],
    ['icon-maskable-512.png', 512, true],
    ['apple-touch-icon.png', 180, true] // iOS no admite transparencia: fondo completo
];
for (const [name, size, maskable] of targets) {
    fs.writeFileSync(path.join(OUT, name), encodePNG(size, drawIcon(size, maskable)));
    console.log(`icons/${name} (${size}x${size})`);
}
