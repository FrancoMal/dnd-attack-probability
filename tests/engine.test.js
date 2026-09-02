const { test } = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../engine.js');
const { oracleHit } = require('./oracle.js');

const EPS = 1e-9;
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < EPS, `${msg}: esperado ${b}, obtenido ${a}`);

const base = (over = {}) => engine.normalizeConfig({
    attackBonus: 5,
    damageBonus: 3,
    damageDice: [{ count: 1, sides: 8 }],
    attackDiceBonus: 0,
    sneakAttackDice: 0,
    advantage: 'normal',
    critRange: 20,
    numberOfAttacks: 1,
    ...over
});

const MODES = ['normal', 'advantage', 'disadvantage'];

// ---------- Probabilidad de impacto ----------

test('hitProbability coincide con el oráculo (crit 20, sin dado extra, tiradas 2..20)', () => {
    for (const advantage of MODES) {
        for (let ab = -3; ab <= 12; ab++) {
            for (let ac = 1; ac <= 30; ac++) {
                const tr = ac - ab;
                if (tr < 2 || tr > 20) continue; // extremos se cubren en tests de bugs B1/B2
                const cfg = base({ attackBonus: ab, advantage });
                const got = engine.hitProbability(cfg, ac);
                const exp = oracleHit(cfg, ac);
                close(got.hit, exp.hit, `hit ${advantage} AB${ab} CA${ac}`);
                close(got.crit, exp.crit, `crit ${advantage} AB${ab} CA${ac}`);
                close(got.miss, exp.miss, `miss ${advantage} AB${ab} CA${ac}`);
            }
        }
    }
});

test('hitProbability con dado extra (Bless d4, Inspiración d6..d12) coincide con el oráculo', () => {
    for (const advantage of MODES) {
        for (const die of [4, 6, 8, 10, 12]) {
            for (const critRange of [20, 19, 18]) {
                for (let ac = 1; ac <= 30; ac += 3) {
                    const cfg = base({ attackBonus: 5, advantage, attackDiceBonus: die, critRange });
                    const got = engine.hitProbability(cfg, ac);
                    const exp = oracleHit(cfg, ac);
                    close(got.hit, exp.hit, `hit ${advantage} d${die} crit${critRange} CA${ac}`);
                    close(got.crit, exp.crit, `crit ${advantage} d${die} crit${critRange} CA${ac}`);
                }
            }
        }
    }
});

test('hitProbability: hit + miss suman 1 y crit <= hit', () => {
    for (const advantage of MODES) {
        for (let ac = 1; ac <= 30; ac++) {
            const p = engine.hitProbability(base({ advantage }), ac);
            close(p.hit + p.miss, 1, `suma ${advantage} CA${ac}`);
            assert.ok(p.crit <= p.hit + EPS, `crit<=hit ${advantage} CA${ac}`);
        }
    }
});

// ---------- Daño ----------

test('damageAverage: 1d8+3 → 7.5 normal, 12 crítico (el bono no se duplica)', () => {
    const cfg = base();
    close(engine.damageAverage(cfg, false), 7.5, 'normal');
    close(engine.damageAverage(cfg, true), 12, 'crit');
});

test('damageRange: 1d8+3 → 4-11 normal, 5-19 crítico', () => {
    const cfg = base();
    assert.deepEqual(engine.damageRange(cfg, false), { min: 4, max: 11 });
    assert.deepEqual(engine.damageRange(cfg, true), { min: 5, max: 19 });
});

test('damageAverage con varios dados: 2d6+1d4+2 → 11.5', () => {
    const cfg = base({ damageDice: [{ count: 2, sides: 6 }, { count: 1, sides: 4 }], damageBonus: 2 });
    close(engine.damageAverage(cfg, false), 11.5, 'normal');
});

test('damageAverage incluye Sneak Attack si se pide, y lo duplica en crítico', () => {
    const cfg = base({ sneakAttackDice: 2 });
    close(engine.damageAverage(cfg, false, true), 7.5 + 7, 'normal+SA');
    close(engine.damageAverage(cfg, true, true), 12 + 14, 'crit+SA');
    close(engine.damageAverage(cfg, false, false), 7.5, 'sin SA');
});

// ---------- DPR ----------

test('dprPerAttack = P(normal)·dañoNormal + P(crit)·dañoCrit', () => {
    const cfg = base(); // +5 vs CA 15: necesita 10 → hit 55%, crit 5%
    const dpr = engine.dprPerAttack(cfg, 15);
    close(dpr, 0.50 * 7.5 + 0.05 * 12, 'dpr');
});

test('sneakAttackPerTurn con 1 ataque: (hit-crit)·SA + crit·2SA', () => {
    const cfg = base({ sneakAttackDice: 2 }); // SA avg 7
    close(engine.sneakAttackPerTurn(cfg, 15), 0.50 * 7 + 0.05 * 14, 'sa 1 ataque');
});

test('sneakAttackPerTurn se aplica una sola vez aunque haya 3 ataques', () => {
    const cfg = base({ sneakAttackDice: 2, numberOfAttacks: 3 });
    const pHit = 0.55, pCrit = 0.05;
    const pNoCrit = (1 - pCrit) ** 3, pNoHit = (1 - pHit) ** 3;
    const expected = (1 - pNoCrit) * 14 + (pNoCrit - pNoHit) * 7;
    close(engine.sneakAttackPerTurn(cfg, 15), expected, 'sa 3 ataques');
    assert.ok(engine.sneakAttackPerTurn(cfg, 15) < 3 * engine.sneakAttackPerTurn(base({ sneakAttackDice: 2 }), 15));
});

test('dprPerTurn = dprPerAttack × n + sneakAttackPerTurn', () => {
    const cfg = base({ sneakAttackDice: 2, numberOfAttacks: 2 });
    const expected = engine.dprPerAttack(cfg, 15) * 2 + engine.sneakAttackPerTurn(cfg, 15);
    close(engine.dprPerTurn(cfg, 15), expected, 'dpr turno');
});

// ---------- Distribución multiataque ----------

test('multiAttackDistribution: las probabilidades suman exactamente 1 (sin filtrar)', () => {
    for (const n of [1, 2, 4, 8]) {
        const dist = engine.multiAttackDistribution(base({ numberOfAttacks: n }), 15);
        const total = dist.reduce((s, g) => s + g.totalProbability, 0);
        close(total, 1, `suma n=${n}`);
        assert.equal(dist.length, n + 1, `grupos n=${n}`);
        for (const g of dist) {
            const sub = g.combinations.reduce((s, c) => s + c.probability, 0);
            close(sub, g.totalProbability, `subtotal hits=${g.totalHits} n=${n}`);
        }
    }
});

test('multiAttackDistribution: con 2 ataques, "2 normales" = P(normal)²', () => {
    const dist = engine.multiAttackDistribution(base({ numberOfAttacks: 2 }), 15);
    const combo = dist[2].combinations.find(c => c.normals === 2 && c.crits === 0);
    close(combo.probability, 0.5 * 0.5, 'p 2 normales');
    assert.equal(combo.damageMin, 8);
    assert.equal(combo.damageMax, 22);
    close(combo.damage, 15, 'daño promedio');
});

test('multiAttackDistribution: el Sneak Attack se suma una vez y se duplica si hay crítico', () => {
    const dist = engine.multiAttackDistribution(base({ numberOfAttacks: 2, sneakAttackDice: 2 }), 15);
    const twoNormals = dist[2].combinations.find(c => c.normals === 2);
    const oneCrit = dist[2].combinations.find(c => c.crits === 1);
    close(twoNormals.damage, 15 + 7, '2 normales + SA');
    close(oneCrit.damage, 7.5 + 12 + 14, '1 normal + 1 crit + SA duplicado');
    assert.equal(dist[0].combinations[0].damage, 0, '0 hits: sin SA');
});

// ---------- normalizeConfig ----------

test('normalizeConfig aplica defaults y limpia valores inválidos', () => {
    const cfg = engine.normalizeConfig({ attackBonus: '7', damageDice: [{ count: 0, sides: 8 }] });
    assert.equal(cfg.attackBonus, 7);
    assert.equal(cfg.critRange, 20);
    assert.equal(cfg.advantage, 'normal');
    assert.equal(cfg.numberOfAttacks, 1);
    assert.equal(cfg.damageDice[0].count, 1);
});

// ---------- Bugs B1 / B2: rangos críticos ampliados y tiradas extremas ----------

test('B1: hitProbability con crit 18-20 / 19-20 coincide con el oráculo en TODO el rango (crit nunca supera a hit)', () => {
    for (const advantage of MODES) {
        for (const critRange of [20, 19, 18]) {
            for (let ab = -5; ab <= 15; ab++) {
                for (let ac = 1; ac <= 30; ac++) {
                    const cfg = base({ attackBonus: ab, advantage, critRange });
                    const got = engine.hitProbability(cfg, ac);
                    const exp = oracleHit(cfg, ac);
                    close(got.hit, exp.hit, `hit ${advantage} crit${critRange} AB${ab} CA${ac}`);
                    close(got.crit, exp.crit, `crit ${advantage} crit${critRange} AB${ab} CA${ac}`);
                    close(got.miss, exp.miss, `miss ${advantage} crit${critRange} AB${ab} CA${ac}`);
                    assert.ok(got.hit - got.crit >= -EPS, `P(normal) negativa ${advantage} crit${critRange} AB${ab} CA${ac}`);
                }
            }
        }
    }
});

test('B2: con desventaja y CA muy baja se falla si CUALQUIER d20 es 1 (90.25%, no 99.75%)', () => {
    const cfg = base({ attackBonus: 10, advantage: 'disadvantage' }); // vs CA 5 → necesita -5
    const p = engine.hitProbability(cfg, 5);
    close(p.hit, 361 / 400, 'hit desventaja auto');
    close(p.miss, 39 / 400, 'miss desventaja auto');
});

test('B1: la distribución multiataque nunca produce probabilidades negativas', () => {
    for (const advantage of MODES) {
        for (const critRange of [19, 18]) {
            const cfg = base({ attackBonus: 5, advantage, critRange, numberOfAttacks: 3 });
            for (let ac = 20; ac <= 30; ac++) {
                for (const g of engine.multiAttackDistribution(cfg, ac)) {
                    for (const c of g.combinations) {
                        assert.ok(c.probability >= -EPS, `negativa ${advantage} crit${critRange} CA${ac} ${c.normals}n/${c.crits}c: ${c.probability}`);
                    }
                }
            }
        }
    }
});

// ---------- Great Weapon Master / Sharpshooter (-5 al ataque, +10 al daño) ----------

test('withPowerAttack: -5 al ataque y +10 al daño, sin mutar la config original', () => {
    const cfg = base();
    const pa = engine.withPowerAttack(cfg);
    assert.equal(pa.attackBonus, 0);
    assert.equal(pa.damageBonus, 13);
    assert.equal(cfg.attackBonus, 5);
    assert.equal(cfg.damageBonus, 3);
});

test('powerAttackComparison: DPR normal vs -5/+10 para cada CA (1d8+3, +5)', () => {
    const rows = engine.powerAttackComparison(base(), 10, 18);
    assert.equal(rows.length, 9);
    const at = (ac) => rows.find(r => r.ac === ac);
    close(at(10).normal, 6.225, 'normal CA10');
    close(at(10).power, 9.85, 'GWM CA10');
    assert.equal(at(10).better, 'power');
    close(at(17).normal, 3.6, 'normal CA17');
    close(at(17).power, 3.725, 'GWM CA17');
    assert.equal(at(17).better, 'power');
    assert.equal(at(18).better, 'normal');
});

test('powerAttackCutoff: mayor CA hasta la que -5/+10 conviene de forma contigua desde CA 1', () => {
    assert.equal(engine.powerAttackCutoff(base()), 17);
    // Con +10 al ataque el corte sube 5 puntos (mismo roll necesario)
    assert.equal(engine.powerAttackCutoff(base({ attackBonus: 10 })), 22);
    // Con un arma enorme (2d6+5, +8, ventaja) el +10 pesa menos en proporción: sigue habiendo corte pero distinto
    const gwm = engine.powerAttackCutoff(base({ damageDice: [{ count: 2, sides: 6 }], damageBonus: 5, attackBonus: 8, advantage: 'advantage' }));
    assert.ok(gwm >= 18 && gwm <= 30, `corte razonable con ventaja: ${gwm}`);
});

test('powerAttackCutoff devuelve null si -5/+10 nunca conviene desde CA 1', () => {
    // Daño base gigante (10d10+50): +10 es irrelevante y el -5 siempre duele
    const cfg = base({ damageDice: [{ count: 10, sides: 10 }], damageBonus: 50, attackBonus: 0 });
    assert.equal(engine.powerAttackCutoff(cfg), null);
});

test('powerAttackComparison usa DPR por turno (respeta nº de ataques y Sneak Attack)', () => {
    const cfg = base({ numberOfAttacks: 2 });
    const row = engine.powerAttackComparison(cfg, 15, 15)[0];
    close(row.normal, engine.dprPerTurn(cfg, 15), 'normal 2 ataques');
    close(row.power, engine.dprPerTurn(engine.withPowerAttack(cfg), 15), 'GWM 2 ataques');
});

// ---------- Power Level ----------

test('powerLevel no vuelve a contar la probabilidad de impacto: es el DPR promedio vs CA 13-20, ×10', () => {
    const cfg = base();
    const acs = [13, 14, 15, 16, 17, 18, 19, 20];
    const esperado = Math.round(acs.reduce((s, ac) => s + engine.dprPerTurn(cfg, ac), 0) / acs.length * 10);
    assert.equal(engine.powerLevel(cfg), esperado);
});

test('powerLevel no depende de la CA objetivo que tenga puesta el usuario', () => {
    const a = engine.powerLevel(base({ targetAC: 10 }));
    const b = engine.powerLevel(base({ targetAC: 25 }));
    const c = engine.powerLevel(base({ targetAC: null }));
    assert.equal(a, b);
    assert.equal(b, c);
});

test('powerLevel: dos builds con daño esperado parecido puntúan parecido, aunque una pegue menos seguido', () => {
    // Precisa y de poco daño vs imprecisa y de mucho daño, ajustadas para dar un DPR similar
    const precisa = base({ attackBonus: 9, damageBonus: 3, damageDice: [{ count: 1, sides: 8 }], numberOfAttacks: 2 });
    const bruta = base({ attackBonus: 2, damageBonus: 13, damageDice: [{ count: 2, sides: 6 }], numberOfAttacks: 2 });

    const dprPrecisa = engine.dprPerTurn(precisa, 16);
    const dprBruta = engine.dprPerTurn(bruta, 16);
    assert.ok(Math.abs(dprPrecisa - dprBruta) < 5, `DPR parecidos: ${dprPrecisa.toFixed(1)} vs ${dprBruta.toFixed(1)}`);

    const ratio = engine.powerLevel(precisa) / engine.powerLevel(bruta);
    assert.ok(ratio > 0.6 && ratio < 1.7, `sin doble penalización, ratio=${ratio.toFixed(2)}`);
});

test('powerLevel crece con el daño y con la precisión', () => {
    const bajo = base({ attackBonus: 3, damageBonus: 1 });
    assert.ok(engine.powerLevel(base()) > engine.powerLevel(bajo));
    assert.ok(engine.powerLevel(base({ attackBonus: 12 })) > engine.powerLevel(base()));
    assert.ok(engine.powerLevel(base({ numberOfAttacks: 3 })) > engine.powerLevel(base()));
});

// ---------- Nivel estimado ----------

test('estimateCharacterLevel elige el tramo que mejor encaja, no el primero que matchea una sola señal', () => {
    // Casos donde el OR devolvía un tramo absurdo
    // 36 de DPR no es una build de nivel 1-4, por más que el bonificador sea bajo
    const muchoDano = engine.estimateCharacterLevel(2, 36);   // antes: nivel 1-4
    assert.ok(muchoDano.max >= 6, `36 de DPR no es nivel 1-4: ${muchoDano.min}-${muchoDano.max}`);

    // 3.9 de DPR no es una build de nivel 15-20, por más que el bonificador sea alto
    const pocoDano = engine.estimateCharacterLevel(12, 3.9);  // antes: nivel 9-16
    assert.ok(pocoDano.max <= 11, `3.9 de DPR no es nivel alto: ${pocoDano.min}-${pocoDano.max}`);

    // Las dos señales se promedian: el resultado queda entre lo que dice cada una
    assert.ok(muchoDano.min > 1 && pocoDano.min > 1, 'ninguna señal domina sola');
});

test('estimateCharacterLevel: una build coherente cae en su tramo', () => {
    const nivel1 = engine.estimateCharacterLevel(5, 8);
    assert.ok(nivel1.min <= 4 && nivel1.max <= 7, `${nivel1.min}-${nivel1.max}`);

    const nivel20 = engine.estimateCharacterLevel(14, 58);
    assert.ok(nivel20.min >= 12, `+14 y 58 de DPR es de nivel alto: ${nivel20.min}-${nivel20.max}`);
});

test('estimateCharacterLevel siempre devuelve un rango válido dentro de 1..20', () => {
    for (const ab of [-5, 0, 5, 10, 20, 40]) {
        for (const dpr of [0, 1, 10, 50, 200, 1000]) {
            const r = engine.estimateCharacterLevel(ab, dpr);
            assert.ok(Number.isInteger(r.min) && Number.isInteger(r.max), `enteros AB${ab} DPR${dpr}`);
            assert.ok(r.min >= 1 && r.max <= 20 && r.min <= r.max, `rango AB${ab} DPR${dpr}: ${r.min}-${r.max}`);
        }
    }
});

test('estimateCharacterLevel es monótono: más daño o más bonificador nunca bajan el nivel', () => {
    let previo = 0;
    for (const dpr of [3, 8, 15, 25, 40, 60, 90]) {
        const actual = engine.estimateCharacterLevel(8, dpr).min;
        assert.ok(actual >= previo, `DPR ${dpr} bajó el nivel: ${actual} < ${previo}`);
        previo = actual;
    }

    previo = 0;
    for (const ab of [-2, 0, 3, 6, 9, 12, 16]) {
        const actual = engine.estimateCharacterLevel(ab, 20).min;
        assert.ok(actual >= previo, `AB ${ab} bajó el nivel: ${actual} < ${previo}`);
        previo = actual;
    }
});
