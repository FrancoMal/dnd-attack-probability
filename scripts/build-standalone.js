#!/usr/bin/env node
/*
 * Genera calculator-standalone.html a partir de index.html + styles.css + engine.js + calculator.js.
 * El resultado es un único archivo sin dependencias externas (se quitan los <link> a CDN).
 *
 * Uso: npm run build:standalone
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const html = read('index.html');
const css = read('styles.css');
const engine = read('engine.js');
const app = read('calculator.js');

// Evitar que un "</script>" dentro del JS cierre el bloque inline
const safeJs = (s) => s.replace(/<\/script/gi, '<\\/script');

let out = html
    // Quitar hojas de estilo externas (CDN de banderas): el standalone tiene que funcionar offline
    .replace(/^\s*<link rel="stylesheet" href="https?:\/\/[^"]+">\s*\n/gm, '')
    // Inlinear CSS local
    .replace(/<link rel="stylesheet" href="styles\.css">/, () => `<style>\n${css}\n    </style>`)
    // Inlinear JS local (motor + app), en el mismo orden que index.html
    .replace(/<script src="engine\.js"><\/script>\s*\n\s*<script src="calculator\.js"><\/script>/,
        () => `<script>\n${safeJs(engine)}\n${safeJs(app)}\n    </script>`);

const header = `<!-- ARCHIVO GENERADO por scripts/build-standalone.js a partir de index.html, styles.css, engine.js y calculator.js. No editar a mano: editá los fuentes y corré "npm run build:standalone". -->\n`;
out = out.replace(/^<!DOCTYPE html>\s*\n/i, (m) => m + header);

if (!out.includes('DnDEngine') || !out.includes('class DnDCalculator')) {
    console.error('Error: el HTML generado no contiene el motor o la app. Revisá los marcadores en index.html.');
    process.exit(1);
}

fs.writeFileSync(path.join(root, 'calculator-standalone.html'), out);
console.log(`calculator-standalone.html generado (${(out.length / 1024).toFixed(0)} KB)`);
