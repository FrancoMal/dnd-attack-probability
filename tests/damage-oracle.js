// Oráculo de fuerza bruta para el daño de un turno.
//
// Enumera TODOS los resultados posibles (secuencia de fallo/impacto/crítico de cada ataque
// y cada cara de cada dado) y arma la distribución sumando probabilidades a mano, con Map
// en vez de convoluciones. Es deliberadamente lento y literal: sirve como "verdad" contra
// la que se valida turnDamageDistribution, que sí usa convoluciones.

const engine = require('../engine.js');

const mult = (value, cfg) => (cfg.damageMultiplier === 0.5 ? Math.floor(value / 2) : value * cfg.damageMultiplier);

// Distribución de un dado como Map cara -> probabilidad, con el relanzamiento de GWF explícito.
function dieMap(sides, gwf) {
    const out = new Map();
    const add = (face, p) => out.set(face, (out.get(face) || 0) + p);
    for (let face = 1; face <= sides; face++) {
        if (gwf && face <= 2) {
            for (let again = 1; again <= sides; again++) add(again, (1 / sides) * (1 / sides));
        } else {
            add(face, 1 / sides);
        }
    }
    return out;
}

// Suma de dos distribuciones independientes.
function sum(a, b) {
    const out = new Map();
    for (const [va, pa] of a) {
        for (const [vb, pb] of b) {
            const v = va + vb;
            out.set(v, (out.get(v) || 0) + pa * pb);
        }
    }
    return out;
}

function diceMap(dice, isCrit, gwf) {
    let dist = new Map([[0, 1]]);
    for (const die of dice) {
        const one = dieMap(die.sides, gwf);
        for (let k = 0; k < die.count * (isCrit ? 2 : 1); k++) dist = sum(dist, one);
    }
    return dist;
}

// Aplica el multiplicador (y su redondeo) a cada resultado posible.
function scale(dist, cfg) {
    const out = new Map();
    for (const [v, p] of dist) {
        const s = Math.max(0, mult(v, cfg));
        out.set(s, (out.get(s) || 0) + p);
    }
    return out;
}

function attackMap(cfg, isCrit) {
    const dice = diceMap(cfg.damageDice, isCrit, cfg.greatWeaponFighting);
    const conBono = new Map();
    for (const [v, p] of dice) {
        const total = Math.max(0, v + cfg.damageBonus);
        conBono.set(total, (conBono.get(total) || 0) + p);
    }
    return scale(conBono, cfg);
}

function sneakMap(cfg, isCrit) {
    if (cfg.sneakAttackDice <= 0) return new Map([[0, 1]]);
    return scale(diceMap([{ count: cfg.sneakAttackDice, sides: 6 }], isCrit, false), cfg);
}

/**
 * Distribución del daño total de un turno, como array indexado por daño.
 * Recorre las 3^n secuencias de resultados posibles una por una.
 */
function oracleTurnDamage(cfg, ac) {
    const { hit, crit } = engine.hitProbability(cfg, ac);
    const outcomes = [
        { p: 1 - hit, kind: 'miss' },
        { p: hit - crit, kind: 'normal' },
        { p: crit, kind: 'crit' }
    ];

    const acumulado = new Map();
    const addResult = (damageDist, weight) => {
        for (const [v, p] of damageDist) acumulado.set(v, (acumulado.get(v) || 0) + p * weight);
    };

    const recorrer = (attacksLeft, prob, damage, hubo, huboCrit) => {
        if (attacksLeft === 0) {
            const sneak = hubo ? sneakMap(cfg, huboCrit) : new Map([[0, 1]]);
            addResult(sum(damage, sneak), prob);
            return;
        }
        for (const o of outcomes) {
            if (o.p === 0) continue;
            if (o.kind === 'miss') {
                recorrer(attacksLeft - 1, prob * o.p, damage, hubo, huboCrit);
            } else {
                const esCrit = o.kind === 'crit';
                recorrer(attacksLeft - 1, prob * o.p, sum(damage, attackMap(cfg, esCrit)), true, huboCrit || esCrit);
            }
        }
    };

    recorrer(cfg.numberOfAttacks, 1, new Map([[0, 1]]), false, false);

    const max = Math.max(...acumulado.keys());
    const dist = new Array(max + 1).fill(0);
    for (const [v, p] of acumulado) dist[v] = p;
    return dist;
}

module.exports = { oracleTurnDamage };
