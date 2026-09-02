const { test } = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../engine.js');
const { oracleTurnDamage } = require('./damage-oracle.js');

const EPS = 1e-9;
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < EPS, `${msg}: esperado ${b}, obtenido ${a}`);

const base = (over = {}) => engine.normalizeConfig({
    attackBonus: 5,
    damageBonus: 3,
    damageDice: [{ count: 1, sides: 8 }],
    numberOfAttacks: 1,
    ...over
});

// ================= Great Weapon Fighting =================

test('dieAverage aplica el relanzamiento de 1 y 2 del GWF', () => {
    // Las dos caras relanzadas pasan a valer el promedio del dado entero.
    close(engine.dieAverage(8, false), 4.5, 'd8 normal');
    close(engine.dieAverage(8, true), 5.25, 'd8 con GWF');
    close(engine.dieAverage(6, true), (2 * 3.5 + 3 + 4 + 5 + 6) / 6, 'd6 con GWF');
    close(engine.dieAverage(4, true), 3, 'd4 con GWF');
    close(engine.dieAverage(12, true), (2 * 6.5 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12) / 12, 'd12 con GWF');

    // Casos degenerados: si todas las caras se relanzan, el promedio no cambia.
    close(engine.dieAverage(2, true), 1.5, 'd2 con GWF');
    close(engine.dieAverage(1, true), 1, 'd1 con GWF');
});

test('el GWF sube el promedio pero no cambia el rango de daño', () => {
    const sin = base();
    const con = base({ greatWeaponFighting: true });

    assert.ok(engine.damageAverage(con, false, false) > engine.damageAverage(sin, false, false),
        'con GWF el promedio tiene que ser mayor');
    close(engine.damageAverage(con, false, false), 5.25 + 3, 'promedio 1d8+3 con GWF');

    // El relanzamiento puede volver a salir 1: el mínimo sigue siendo el mismo.
    assert.deepEqual(engine.damageRange(con, false, false), engine.damageRange(sin, false, false));
    assert.deepEqual(engine.damageRange(con, true, false), engine.damageRange(sin, true, false));
});

test('el GWF no toca los dados de Sneak Attack (no son dados del arma)', () => {
    const sin = base({ sneakAttackDice: 3 });
    const con = base({ sneakAttackDice: 3, greatWeaponFighting: true });

    close(engine.sneakAttackAverage(con, false), engine.sneakAttackAverage(sin, false), 'sneak normal');
    close(engine.sneakAttackAverage(con, true), engine.sneakAttackAverage(sin, true), 'sneak crítico');

    // La diferencia en el daño total es exactamente la del dado de arma.
    const delta = engine.damageAverage(con, false, true) - engine.damageAverage(sin, false, true);
    close(delta, 5.25 - 4.5, 'la mejora viene solo del d8 del arma');
});

// ================= Resistencia y vulnerabilidad =================

test('normalizeConfig solo acepta multiplicadores válidos', () => {
    close(base().damageMultiplier, 1, 'por defecto');
    close(base({ damageMultiplier: 0.5 }).damageMultiplier, 0.5, 'resistencia');
    close(base({ damageMultiplier: 2 }).damageMultiplier, 2, 'vulnerabilidad');
    close(base({ damageMultiplier: '2' }).damageMultiplier, 2, 'string numérico');

    for (const raro of [0, 3, -1, 0.25, 'mucho', null, undefined, NaN, {}]) {
        close(base({ damageMultiplier: raro }).damageMultiplier, 1, `valor inválido ${String(raro)}`);
    }
});

test('la resistencia divide y la vulnerabilidad duplica el DPR', () => {
    const normal = base({ numberOfAttacks: 2, sneakAttackDice: 2 });
    const resistente = base({ numberOfAttacks: 2, sneakAttackDice: 2, damageMultiplier: 0.5 });
    const vulnerable = base({ numberOfAttacks: 2, sneakAttackDice: 2, damageMultiplier: 2 });

    for (let ac = 5; ac <= 25; ac++) {
        close(engine.dprPerTurn(resistente, ac), engine.dprPerTurn(normal, ac) / 2, `resistencia CA${ac}`);
        close(engine.dprPerTurn(vulnerable, ac), engine.dprPerTurn(normal, ac) * 2, `vulnerabilidad CA${ac}`);
    }
});

test('el rango de daño con resistencia redondea hacia abajo, como en 5e', () => {
    // 1d8+3: 4-11 normal; con resistencia 2-5 (floor(4/2) y floor(11/2)).
    assert.deepEqual(engine.damageRange(base({ damageMultiplier: 0.5 }), false, false), { min: 2, max: 5 });
    assert.deepEqual(engine.damageRange(base({ damageMultiplier: 2 }), false, false), { min: 8, max: 22 });
});

test('la resistencia no cambia la probabilidad de impacto', () => {
    const normal = base();
    const resistente = base({ damageMultiplier: 0.5 });
    for (let ac = 1; ac <= 30; ac++) {
        assert.deepEqual(engine.hitProbability(resistente, ac), engine.hitProbability(normal, ac), `CA${ac}`);
    }
});

// ================= Distribución exacta de daño =================

const CONFIGS_DISTRIBUCION = [
    ['1 ataque, 1d8+3', base()],
    ['1 ataque sin bono', base({ damageBonus: 0 })],
    ['2 ataques', base({ numberOfAttacks: 2 })],
    ['3 ataques, dos tipos de dado', base({ numberOfAttacks: 3, damageDice: [{ count: 1, sides: 6 }, { count: 1, sides: 4 }] })],
    ['con Sneak Attack', base({ numberOfAttacks: 2, sneakAttackDice: 2 })],
    ['con GWF', base({ greatWeaponFighting: true, damageDice: [{ count: 2, sides: 6 }] })],
    ['con GWF y Sneak', base({ numberOfAttacks: 2, greatWeaponFighting: true, sneakAttackDice: 1 })],
    ['con resistencia', base({ numberOfAttacks: 2, damageMultiplier: 0.5 })],
    ['con vulnerabilidad', base({ damageMultiplier: 2, sneakAttackDice: 1 })],
    ['con ventaja y crítico ampliado', base({ advantage: 'advantage', critRange: 19, numberOfAttacks: 2 })],
    ['con dado extra al ataque', base({ attackDiceBonus: 4, numberOfAttacks: 2 })],
    ['bono de daño negativo', base({ damageBonus: -2 })]
];

test('turnDamageDistribution suma exactamente 1', () => {
    for (const [nombre, cfg] of CONFIGS_DISTRIBUCION) {
        for (const ac of [5, 15, 25]) {
            const dist = engine.turnDamageDistribution(cfg, ac);
            close(dist.reduce((a, b) => a + b, 0), 1, `${nombre} CA${ac}`);
            assert.ok(dist.every(p => p >= -EPS), `${nombre}: probabilidades negativas`);
        }
    }
});

test('el promedio de la distribución coincide con el DPR calculado por fórmula', () => {
    // Los dos caminos son independientes: uno acumula promedios, el otro convoluciona
    // dados. Si difieren, alguno de los dos está mal.
    for (const [nombre, cfg] of CONFIGS_DISTRIBUCION) {
        if (cfg.damageMultiplier === 0.5) continue; // el redondeo hacia abajo los separa a propósito
        if (cfg.damageBonus < 0) continue;           // el recorte en 0 también (ver test siguiente)
        for (const ac of [8, 15, 22]) {
            const dist = engine.turnDamageDistribution(cfg, ac);
            close(engine.distributionAverage(dist), engine.dprPerTurn(cfg, ac), `${nombre} CA${ac}`);
        }
    }
});

test('turnDamageDistribution coincide con el oráculo de fuerza bruta', () => {
    for (const [nombre, cfg] of CONFIGS_DISTRIBUCION) {
        for (const ac of [10, 18]) {
            const got = engine.turnDamageDistribution(cfg, ac);
            const exp = oracleTurnDamage(cfg, ac);
            const largo = Math.max(got.length, exp.length);
            for (let d = 0; d < largo; d++) {
                close(got[d] || 0, exp[d] || 0, `${nombre} CA${ac} daño ${d}`);
            }
        }
    }
});

test('con resistencia el promedio baja un poco más que la mitad por el redondeo', () => {
    const cfg = base({ damageMultiplier: 0.5 });
    const exacto = engine.distributionAverage(engine.turnDamageDistribution(cfg, 15));
    const sinRedondeo = engine.dprPerTurn(cfg, 15);

    assert.ok(exacto <= sinRedondeo + EPS, 'redondear hacia abajo nunca puede subir el promedio');
    assert.ok(sinRedondeo - exacto < 0.5, `la diferencia es menor a medio punto: ${sinRedondeo - exacto}`);
});

test('con un bono de daño negativo la distribución recorta en 0, no cura', () => {
    // 1d8-2 puede dar -1 por fórmula; en la mesa eso es 0 de daño.
    const cfg = base({ damageBonus: -2 });
    const dist = engine.turnDamageDistribution(cfg, 8);

    assert.ok(dist.every(p => p >= -EPS), 'no hay probabilidades negativas');
    assert.ok(engine.distributionAverage(dist) > engine.dprPerTurn(cfg, 8),
        'recortar en 0 sube el promedio respecto de la fórmula, que sí admite negativos');
});

test('turnDamageDistribution devuelve null si la build es demasiado grande', () => {
    const enorme = base({ damageDice: [{ count: 100, sides: 100 }], numberOfAttacks: 20 });
    assert.equal(engine.turnDamageDistribution(enorme, 15), null);
    assert.equal(engine.killProbability(enorme, 15, 50), null);
});

// ================= Probabilidad de matar =================

test('killProbability con 1 PV es la probabilidad de impactar al menos una vez', () => {
    // Cualquier impacto hace al menos 1 de daño, así que las dos preguntas son la misma.
    for (const n of [1, 2, 3]) {
        for (const ac of [10, 15, 20]) {
            const cfg = base({ numberOfAttacks: n });
            const { hit } = engine.hitProbability(cfg, ac);
            close(engine.killProbability(cfg, ac, 1), 1 - (1 - hit) ** n, `${n} ataques CA${ac}`);
        }
    }
});

test('killProbability baja al subir los PV y respeta los extremos', () => {
    const cfg = base({ numberOfAttacks: 2, sneakAttackDice: 2 });
    const dist = engine.turnDamageDistribution(cfg, 15);

    close(engine.killProbability(cfg, 15, 0), 1, 'con 0 PV ya está muerto');
    close(engine.killProbability(cfg, 15, dist.length - 1, dist), dist[dist.length - 1], 'el daño máximo exacto');
    close(engine.killProbability(cfg, 15, 10000), 0, 'PV inalcanzables');

    let previo = 1;
    for (let hp = 1; hp < dist.length + 5; hp++) {
        const p = engine.killProbability(cfg, 15, hp, dist);
        assert.ok(p <= previo + EPS, `P(matar) subió al pasar de ${hp - 1} a ${hp} PV`);
        assert.ok(p >= -EPS && p <= 1 + EPS, `probabilidad fuera de rango en ${hp} PV`);
        previo = p;
    }
});

test('killProbability empeora contra un objetivo resistente y mejora contra uno vulnerable', () => {
    const normal = base({ numberOfAttacks: 2 });
    const resistente = base({ numberOfAttacks: 2, damageMultiplier: 0.5 });
    const vulnerable = base({ numberOfAttacks: 2, damageMultiplier: 2 });

    const hp = 15;
    const pNormal = engine.killProbability(normal, 15, hp);
    assert.ok(engine.killProbability(resistente, 15, hp) < pNormal, 'resistencia');
    assert.ok(engine.killProbability(vulnerable, 15, hp) > pNormal, 'vulnerabilidad');
});

test('killProbability acepta una distribución ya calculada y da lo mismo', () => {
    const cfg = base({ numberOfAttacks: 2 });
    const dist = engine.turnDamageDistribution(cfg, 15);
    for (const hp of [1, 5, 12, 30]) {
        close(engine.killProbability(cfg, 15, hp, dist), engine.killProbability(cfg, 15, hp), `${hp} PV`);
    }
});

// ================= Curva de DPR contra el rango de CA =================

test('dprCurve cubre el rango pedido y baja a medida que sube la CA', () => {
    const cfg = base({ numberOfAttacks: 2 });
    const curva = engine.dprCurve(cfg);

    assert.equal(curva[0].ac, engine.DPR_CURVE_AC_MIN);
    assert.equal(curva[curva.length - 1].ac, engine.DPR_CURVE_AC_MAX);
    assert.equal(curva.length, engine.DPR_CURVE_AC_MAX - engine.DPR_CURVE_AC_MIN + 1);

    for (let i = 1; i < curva.length; i++) {
        assert.ok(curva[i].dpr <= curva[i - 1].dpr + EPS, `el DPR subió al pasar a CA ${curva[i].ac}`);
        close(curva[i].dpr, engine.dprPerTurn(cfg, curva[i].ac), `CA${curva[i].ac}`);
    }
});

test('curveLeadChanges encuentra la CA donde una build pasa a la otra', () => {
    // Bruta: pega poco seguido pero fuerte. Precisa: acierta casi siempre y pega menos.
    const bruta = base({ attackBonus: 3, damageBonus: 2, damageDice: [{ count: 4, sides: 6 }] });
    const precisa = base({ attackBonus: 11, damageBonus: 6, damageDice: [{ count: 1, sides: 6 }] });

    const curvas = [engine.dprCurve(bruta), engine.dprCurve(precisa)];
    const cruces = engine.curveLeadChanges(curvas);

    assert.equal(cruces.length, 1, `debería haber un solo cruce, hubo ${cruces.length}`);
    const cruce = cruces[0];
    assert.equal(cruce.from, 0, 'contra CA baja gana la build de daño alto');
    assert.equal(cruce.to, 1, 'contra CA alta gana la build precisa');

    // El cruce está donde dice: la CA anterior la gana una y esa CA la gana la otra.
    const i = curvas[0].findIndex(p => p.ac === cruce.ac);
    assert.ok(curvas[0][i - 1].dpr > curvas[1][i - 1].dpr, `CA ${cruce.ac - 1} debía ganarla la bruta`);
    assert.ok(curvas[1][i].dpr > curvas[0][i].dpr, `CA ${cruce.ac} debía ganarla la precisa`);
});

test('curveLeadChanges no inventa cruces cuando una build domina siempre', () => {
    const floja = base();
    const fuerte = base({ attackBonus: 9, damageBonus: 8, damageDice: [{ count: 2, sides: 8 }] });

    assert.deepEqual(engine.curveLeadChanges([engine.dprCurve(floja), engine.dprCurve(fuerte)]), []);
    assert.deepEqual(engine.curveLeadChanges([engine.dprCurve(floja)]), [], 'una sola curva no tiene cruces');
    assert.deepEqual(engine.curveLeadChanges([]), [], 'sin curvas tampoco');

    // Dos perfiles idénticos empatan en todas las CAs: gana el primero y no hay cruces.
    assert.deepEqual(engine.curveLeadChanges([engine.dprCurve(floja), engine.dprCurve(base())]), []);
});
