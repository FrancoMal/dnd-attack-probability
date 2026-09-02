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
