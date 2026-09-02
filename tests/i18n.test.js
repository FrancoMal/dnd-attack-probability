// Tests de las traducciones de calculator.js.
//
// calculator.js es un script de navegador (toca el DOM), así que no se puede require():
// se lee como texto y se parsean los bloques de idioma. Vale la pena igual, porque una
// clave repetida no rompe nada de forma visible: la segunda pisa a la primera y el error
// aparece como un cartel raro en la interfaz, en un idioma, meses después.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const fuente = fs.readFileSync(path.join(__dirname, '..', 'calculator.js'), 'utf8');
const IDIOMAS = ['es', 'en', 'pt', 'de'];

function bloqueDeIdioma(lang) {
    const inicio = fuente.indexOf(`    ${lang}: {\n`);
    assert.notEqual(inicio, -1, `no se encontró el bloque del idioma ${lang}`);

    const siguiente = IDIOMAS.map(otro => fuente.indexOf(`    ${otro}: {\n`))
        .filter(pos => pos > inicio);
    const fin = siguiente.length ? Math.min(...siguiente) : fuente.indexOf('\n};', inicio);
    return fuente.slice(inicio, fin);
}

function clavesDe(lang) {
    return [...bloqueDeIdioma(lang).matchAll(/^        ([A-Za-z0-9_]+):/gm)].map(m => m[1]);
}

test('ningún idioma tiene claves repetidas', () => {
    for (const lang of IDIOMAS) {
        const claves = clavesDe(lang);
        const repetidas = claves.filter((clave, i) => claves.indexOf(clave) !== i);
        assert.deepEqual([...new Set(repetidas)], [], `claves repetidas en ${lang}`);
    }
});

test('todos los idiomas tienen exactamente las mismas claves', () => {
    const referencia = clavesDe('es').slice().sort();
    for (const lang of IDIOMAS.slice(1)) {
        const claves = clavesDe(lang).slice().sort();
        const faltan = referencia.filter(c => !claves.includes(c));
        const sobran = claves.filter(c => !referencia.includes(c));
        assert.deepEqual(faltan, [], `faltan en ${lang}`);
        assert.deepEqual(sobran, [], `sobran en ${lang}`);
    }
});

test('cada data-i18n del HTML tiene traducción', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const claves = clavesDe('es');
    const usadas = [...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map(m => m[1]);

    const huerfanas = [...new Set(usadas)].filter(c => !claves.includes(c));
    assert.deepEqual(huerfanas, [], 'claves usadas en el HTML que no existen en las traducciones');
});
