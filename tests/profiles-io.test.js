const { test } = require('node:test');
const assert = require('node:assert/strict');
const io = require('../profiles-io.js');

const FIXED = '2026-01-15T12:00:00.000Z';

// Perfil en forma canónica: es exactamente lo que produce exportProfiles / importProfiles.
const perfil = (over = {}) => ({
    id: 'abc123',
    name: 'Pícaro',
    createdAt: 1700000000000,
    config: {
        attackBonus: 7,
        damageBonus: 4,
        damageDice: [{ count: 1, sides: 6 }],
        attackDiceBonus: 0,
        sneakAttackDice: 3,
        advantage: 'advantage',
        critRange: 20,
        numberOfAttacks: 1,
        targetAC: 15,
        powerAttack: false,
        damageMultiplier: 1,
        greatWeaponFighting: false
    },
    ...over
});

// ---------- Exportar ----------

test('exportProfiles genera un JSON con sobre (formato, versión, fecha) y los perfiles', () => {
    const texto = io.exportProfiles([perfil()], { exportedAt: FIXED });
    const data = JSON.parse(texto);
    assert.equal(data.format, 'dnd-attack-probability-profiles');
    assert.equal(data.version, 1);
    assert.equal(data.exportedAt, FIXED);
    assert.equal(data.profiles.length, 1);
    assert.equal(data.profiles[0].name, 'Pícaro');
});

test('exportProfiles sin perfiles produce una lista vacía, no un error', () => {
    const data = JSON.parse(io.exportProfiles([], { exportedAt: FIXED }));
    assert.deepEqual(data.profiles, []);
});

// ---------- Round-trip ----------

test('round-trip: exportar e importar devuelve exactamente los mismos perfiles', () => {
    const original = [
        perfil(),
        perfil({ id: 'def456', name: 'Bárbaro', updatedAt: 1700000009999, config: { ...perfil().config, attackBonus: 9, sneakAttackDice: 0, advantage: 'normal', powerAttack: true } })
    ];
    const resultado = io.importProfiles(io.exportProfiles(original, { exportedAt: FIXED }));

    assert.equal(resultado.ok, true);
    assert.deepEqual(resultado.profiles, original);
    assert.deepEqual(resultado.skipped, []);
});

test('round-trip: el segundo export es byte a byte igual al primero (es estable)', () => {
    const original = [perfil(), perfil({ id: 'def456', name: 'Bárbaro' })];
    const primero = io.exportProfiles(original, { exportedAt: FIXED });
    const segundo = io.exportProfiles(io.importProfiles(primero).profiles, { exportedAt: FIXED });
    assert.equal(segundo, primero);
});

test('round-trip: conserva updatedAt sólo si el perfil lo tenía', () => {
    const conUpdate = io.importProfiles(io.exportProfiles([perfil({ updatedAt: 123 })], { exportedAt: FIXED })).profiles[0];
    const sinUpdate = io.importProfiles(io.exportProfiles([perfil()], { exportedAt: FIXED })).profiles[0];
    assert.equal(conUpdate.updatedAt, 123);
    assert.equal('updatedAt' in sinUpdate, false);
});

// ---------- Errores de archivo ----------

test('archivo vacío: error, sin perfiles', () => {
    for (const texto of ['', '   ', '\n\t  \n']) {
        const r = io.importProfiles(texto);
        assert.equal(r.ok, false, `vacío: ${JSON.stringify(texto)}`);
        assert.equal(r.errorKey, 'importErrorEmpty');
        assert.deepEqual(r.profiles, []);
    }
});

test('archivo sin contenido (null/undefined): mismo error de archivo vacío', () => {
    assert.equal(io.importProfiles(null).errorKey, 'importErrorEmpty');
    assert.equal(io.importProfiles(undefined).errorKey, 'importErrorEmpty');
});

test('JSON inválido: error específico, sin lanzar excepción', () => {
    for (const texto of ['{', 'no soy json', '{"profiles": [}', '[1, 2,]']) {
        const r = io.importProfiles(texto);
        assert.equal(r.ok, false, `inválido: ${texto}`);
        assert.equal(r.errorKey, 'importErrorInvalidJson');
    }
});

test('JSON válido pero sin lista de perfiles: error de formato', () => {
    for (const texto of ['{"format":"otra-cosa"}', '{"profiles": 5}', '"texto suelto"', 'null', '42']) {
        const r = io.importProfiles(texto);
        assert.equal(r.ok, false, `formato: ${texto}`);
        assert.equal(r.errorKey, 'importErrorFormat');
    }
});

test('acepta un array pelado de perfiles (archivo escrito a mano)', () => {
    const r = io.importProfiles(JSON.stringify([perfil()]));
    assert.equal(r.ok, true);
    assert.equal(r.profiles.length, 1);
});

// ---------- Perfiles sin campos obligatorios ----------

test('perfil sin campos obligatorios: se omite y se reporta el motivo', () => {
    const invalidos = [
        [{ config: perfil().config }, 'name'],                                  // sin nombre
        [{ name: '   ', config: perfil().config }, 'name'],                      // nombre vacío
        [{ name: 'X' }, 'config'],                                               // sin config
        [{ name: 'X', config: 'no soy objeto' }, 'config'],                      // config no es objeto
        [{ name: 'X', config: { attackBonus: 5 } }, 'config.damageDice'],        // sin dados
        [{ name: 'X', config: { attackBonus: 5, damageDice: [] } }, 'config.damageDice'],
        [{ name: 'X', config: { attackBonus: 5, damageDice: [{ count: 1 }] } }, 'config.damageDice'],
        [{ name: 'X', config: { damageDice: [{ count: 1, sides: 6 }] } }, 'config.attackBonus'],
        ['no soy un objeto', 'profile'],
        [null, 'profile']
    ];

    for (const [entrada, campoEsperado] of invalidos) {
        const r = io.importProfiles(JSON.stringify({ profiles: [entrada] }));
        assert.equal(r.ok, false, `debería fallar: ${JSON.stringify(entrada)}`);
        assert.equal(r.errorKey, 'importErrorNoValidProfiles');
        assert.equal(r.skipped.length, 1);
        assert.equal(r.skipped[0].field, campoEsperado, `campo para ${JSON.stringify(entrada)}`);
        assert.equal(r.skipped[0].index, 0);
    }
});

test('importa los perfiles válidos y omite sólo los rotos', () => {
    const r = io.importProfiles(JSON.stringify({
        profiles: [perfil({ id: 'uno', name: 'Bueno' }), { name: 'Roto' }, perfil({ id: 'dos', name: 'Otro' })]
    }));
    assert.equal(r.ok, true);
    assert.deepEqual(r.profiles.map(p => p.name), ['Bueno', 'Otro']);
    assert.equal(r.skipped.length, 1);
    assert.equal(r.skipped[0].index, 1);
    assert.equal(r.skipped[0].name, 'Roto');
});

// ---------- Saneado ----------

test('sanea valores fuera de rango y descarta campos desconocidos', () => {
    const r = io.importProfiles(JSON.stringify({
        profiles: [{
            id: 'x', name: '  Espadachín  ', createdAt: 111, malicioso: '<script>',
            config: { attackBonus: 999, damageBonus: -50, damageDice: [{ count: 999, sides: 8 }], advantage: 'inventada', critRange: 3, numberOfAttacks: 99, targetAC: 99, sneakAttackDice: 50, powerAttack: 'sí', otroCampo: 1 }
        }]
    }));
    const p = r.profiles[0];
    assert.equal(r.ok, true);
    assert.equal(p.name, 'Espadachín', 'recorta espacios');
    assert.equal('malicioso' in p, false, 'descarta campos desconocidos del perfil');
    assert.equal('otroCampo' in p.config, false, 'descarta campos desconocidos de la config');
    assert.equal(p.config.attackBonus, 40, 'acota el bono de ataque');
    assert.equal(p.config.numberOfAttacks, 20, 'acota el nº de ataques');
    assert.equal(p.config.advantage, 'normal', 'ventaja inválida vuelve a normal');
    assert.equal(p.config.powerAttack, true, 'powerAttack queda booleano');
});

test('genera id y createdAt cuando faltan (no son datos del usuario)', () => {
    const r = io.importProfiles(JSON.stringify({ profiles: [{ name: 'Sin id', config: perfil().config }] }));
    assert.equal(r.ok, true);
    assert.equal(typeof r.profiles[0].id, 'string');
    assert.ok(r.profiles[0].id.length > 0);
    assert.equal(typeof r.profiles[0].createdAt, 'number');
});

test('el nombre se recorta a un largo razonable', () => {
    const largo = 'A'.repeat(500);
    const r = io.importProfiles(JSON.stringify({ profiles: [{ name: largo, config: perfil().config }] }));
    assert.equal(r.profiles[0].name.length, 80);
});

// ---------- Fusión con los perfiles existentes ----------

test('mergeProfiles antepone los importados y reasigna los ids repetidos', () => {
    const existentes = [perfil({ id: 'abc123', name: 'Viejo' })];
    const importados = [perfil({ id: 'abc123', name: 'Nuevo' })];
    const fusion = io.mergeProfiles(existentes, importados);

    assert.equal(fusion.length, 2, 'no pisa el existente');
    assert.deepEqual(fusion.map(p => p.name), ['Nuevo', 'Viejo']);
    assert.notEqual(fusion[0].id, fusion[1].id, 'los ids quedan únicos');
    assert.equal(fusion[1].id, 'abc123', 'el existente conserva su id');
});

test('mergeProfiles no toca los originales', () => {
    const existentes = [perfil()];
    const copia = JSON.parse(JSON.stringify(existentes));
    io.mergeProfiles(existentes, [perfil({ id: 'abc123' })]);
    assert.deepEqual(existentes, copia);
});

// ---------- Nombre de archivo ----------

test('exportFilename incluye la fecha y termina en .json', () => {
    const nombre = io.exportFilename(new Date(FIXED));
    assert.match(nombre, /^perfiles-dnd-2026-01-15\.json$/);
});
