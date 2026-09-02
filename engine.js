/*
 * engine.js — Motor de probabilidad y daño para D&D 5e.
 *
 * Funciones puras, sin DOM. Es la ÚNICA fuente de verdad de la matemática:
 * la usan calculator.js (UI, comparador de perfiles) y calculator-standalone.html.
 *
 * Funciona como módulo CommonJS (tests en Node) y como global `DnDEngine` en el navegador.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.DnDEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const ADVANTAGE_MODES = ['normal', 'advantage', 'disadvantage'];

    // ---------- Configuración ----------

    function toInt(value, fallback) {
        const n = parseInt(value, 10);
        return Number.isFinite(n) ? n : fallback;
    }

    function clamp(n, min, max) {
        return Math.min(max, Math.max(min, n));
    }

    /**
     * Devuelve una configuración completa y saneada a partir de una parcial.
     * Nunca muta el objeto de entrada.
     */
    function normalizeConfig(input) {
        const cfg = input || {};
        const dice = Array.isArray(cfg.damageDice) && cfg.damageDice.length > 0
            ? cfg.damageDice
            : [{ count: 1, sides: 8 }];

        return {
            attackBonus: clamp(toInt(cfg.attackBonus, 0), -20, 40),
            damageBonus: clamp(toInt(cfg.damageBonus, 0), -20, 100),
            damageDice: dice.map(d => ({
                count: clamp(toInt(d.count, 1), 1, 100),
                sides: clamp(toInt(d.sides, 6), 1, 100)
            })),
            attackDiceBonus: clamp(toInt(cfg.attackDiceBonus, 0), 0, 20),
            sneakAttackDice: clamp(toInt(cfg.sneakAttackDice, 0), 0, 20),
            advantage: ADVANTAGE_MODES.includes(cfg.advantage) ? cfg.advantage : 'normal',
            critRange: clamp(toInt(cfg.critRange, 20), 2, 20),
            numberOfAttacks: clamp(toInt(cfg.numberOfAttacks, 1), 1, 20),
            targetAC: cfg.targetAC == null || cfg.targetAC === '' ? null : clamp(toInt(cfg.targetAC, 15), 1, 40)
        };
    }

    // ---------- Probabilidad de impacto ----------

    /**
     * P(resultado efectivo del d20 >= x). Con ventaja/desventaja el "resultado
     * efectivo" es el máximo/mínimo de dos d20.
     */
    function pAtLeast(x, advantage) {
        const single = (21 - clamp(x, 1, 21)) / 20;
        if (advantage === 'advantage') return 1 - (1 - single) ** 2;
        if (advantage === 'disadvantage') return single ** 2;
        return single;
    }

    /**
     * Fórmula cerrada sin dado extra. Dos invariantes de 5e:
     *  - El 1 natural siempre falla → como mínimo necesitás un 2.
     *  - El crítico siempre impacta → hit nunca puede ser menor que crit
     *    (importa cuando el rango crítico es 18-20/19-20 y necesitás 19 o 20 para pegar).
     */
    function closedFormProbability(targetRoll, critMin, advantage) {
        const crit = pAtLeast(critMin, advantage);
        const hit = Math.max(pAtLeast(Math.max(2, targetRoll), advantage), crit);
        return { hit, crit, miss: 1 - hit };
    }

    /**
     * Con dado extra al ataque (Bless d4, Inspiración Bárdica dN) no hay fórmula
     * cerrada cómoda: se enumeran todas las combinaciones. Reglas:
     *  - 1 natural en el d20 (el que se usa) = fallo, sin importar el dado extra.
     *  - Crítico se decide solo por el d20.
     *  - El crítico siempre impacta.
     */
    function bonusDieProbability(targetRoll, critMin, advantage, bonusSides) {
        let hit = 0, crit = 0, total = 0;
        const twoDice = advantage !== 'normal';

        for (let d1 = 1; d1 <= 20; d1++) {
            for (let d2 = 1; d2 <= 20; d2++) {
                if (!twoDice && d2 !== 1) continue;
                const d20 = advantage === 'advantage' ? Math.max(d1, d2)
                          : advantage === 'disadvantage' ? Math.min(d1, d2)
                          : d1;
                for (let b = 1; b <= bonusSides; b++) {
                    total++;
                    if (d20 === 1) continue;
                    if (d20 >= critMin) { crit++; hit++; continue; }
                    if (d20 + b >= targetRoll) hit++;
                }
            }
        }
        return { hit: hit / total, crit: crit / total, miss: 1 - hit / total };
    }

    /**
     * Probabilidades de fallo / impacto / crítico de UN ataque contra una CA.
     * `hit` incluye a los críticos; impacto normal = hit - crit.
     */
    function hitProbability(cfg, ac) {
        const targetRoll = ac - cfg.attackBonus;
        const critMin = cfg.critRange;

        if (cfg.attackDiceBonus > 0) {
            return bonusDieProbability(targetRoll, critMin, cfg.advantage, cfg.attackDiceBonus);
        }
        return closedFormProbability(targetRoll, critMin, cfg.advantage);
    }

    // ---------- Daño ----------

    const SNEAK_DIE_AVG = 3.5;

    function sneakAttackAverage(cfg, isCrit) {
        return cfg.sneakAttackDice * (isCrit ? 2 : 1) * SNEAK_DIE_AVG;
    }

    function sneakAttackRange(cfg, isCrit) {
        const dice = cfg.sneakAttackDice * (isCrit ? 2 : 1);
        return { min: dice, max: dice * 6 };
    }

    /**
     * Daño promedio de un impacto. Los dados se duplican en crítico; el bono no.
     * includeSneak: sumar el Sneak Attack a este impacto (útil solo para 1 ataque/turno).
     */
    function damageAverage(cfg, isCrit, includeSneak) {
        let total = cfg.damageBonus;
        for (const die of cfg.damageDice) {
            total += die.count * (isCrit ? 2 : 1) * (1 + die.sides) / 2;
        }
        if (includeSneak) total += sneakAttackAverage(cfg, isCrit);
        return total;
    }

    function damageRange(cfg, isCrit, includeSneak) {
        let min = cfg.damageBonus, max = cfg.damageBonus;
        for (const die of cfg.damageDice) {
            const n = die.count * (isCrit ? 2 : 1);
            min += n;
            max += n * die.sides;
        }
        if (includeSneak) {
            const sa = sneakAttackRange(cfg, isCrit);
            min += sa.min;
            max += sa.max;
        }
        return { min, max };
    }

    // ---------- DPR ----------

    /** Daño esperado de UN ataque de arma (sin Sneak Attack). */
    function dprPerAttack(cfg, ac) {
        const { hit, crit } = hitProbability(cfg, ac);
        return (hit - crit) * damageAverage(cfg, false, false) + crit * damageAverage(cfg, true, false);
    }

    /**
     * Sneak Attack esperado POR TURNO: se aplica una sola vez, al mejor impacto.
     * Se duplica si algún ataque del turno fue crítico.
     */
    function sneakAttackPerTurn(cfg, ac) {
        if (cfg.sneakAttackDice <= 0) return 0;
        const { hit, crit } = hitProbability(cfg, ac);
        const n = cfg.numberOfAttacks;
        const avg = sneakAttackAverage(cfg, false);
        const pNoCrit = Math.pow(1 - crit, n);
        const pNoHit = Math.pow(1 - hit, n);
        return (1 - pNoCrit) * 2 * avg + (pNoCrit - pNoHit) * avg;
    }

    /** Daño esperado total del turno: arma × nº de ataques + Sneak Attack. */
    function dprPerTurn(cfg, ac) {
        return dprPerAttack(cfg, ac) * cfg.numberOfAttacks + sneakAttackPerTurn(cfg, ac);
    }

    // ---------- Great Weapon Master / Sharpshooter ----------

    const POWER_ATTACK_TO_HIT = -5;
    const POWER_ATTACK_DAMAGE = 10;

    /** Misma config con la penalización/bono de GWM o Sharpshooter aplicada. No muta la original. */
    function withPowerAttack(cfg) {
        return Object.assign({}, cfg, {
            attackBonus: cfg.attackBonus + POWER_ATTACK_TO_HIT,
            damageBonus: cfg.damageBonus + POWER_ATTACK_DAMAGE
        });
    }

    /**
     * DPR por turno con y sin -5/+10 para cada CA del rango.
     * better: 'power' si conviene activar el rasgo, 'normal' si no, 'tie' si empatan.
     */
    function powerAttackComparison(cfg, acMin, acMax) {
        const pa = withPowerAttack(cfg);
        const rows = [];
        for (let ac = acMin; ac <= acMax; ac++) {
            const normal = dprPerTurn(cfg, ac);
            const power = dprPerTurn(pa, ac);
            const diff = power - normal;
            rows.push({
                ac,
                normal,
                power,
                delta: diff,
                better: Math.abs(diff) < 1e-9 ? 'tie' : diff > 0 ? 'power' : 'normal'
            });
        }
        return rows;
    }

    /**
     * CA de corte: la mayor CA hasta la cual -5/+10 conviene de forma CONTIGUA desde CA 1.
     * Es la regla accionable en mesa ("usá GWM contra CA <= X"). Contra CAs altísimas donde
     * solo se pega con crítico el +10 puede volver a ganar; ese tramo se ignora acá y queda
     * visible en powerAttackComparison.
     * Devuelve null si ya en CA 1 no conviene.
     */
    function powerAttackCutoff(cfg, acMax = 30) {
        let cutoff = null;
        for (const row of powerAttackComparison(cfg, 1, acMax)) {
            if (row.better === 'normal') break;
            cutoff = row.ac;
        }
        return cutoff;
    }

    // ---------- Distribución multiataque ----------

    function factorial(n) {
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }

    function multinomial(n, a, b, c) {
        return factorial(n) / (factorial(a) * factorial(b) * factorial(c));
    }

    /**
     * Distribución completa de resultados de un turno con n ataques.
     * Devuelve un grupo por cantidad de impactos (0..n); cada grupo lista las
     * combinaciones normales/críticos con su probabilidad y daño (prom, min, max).
     * NO filtra nada: las probabilidades suman exactamente 1. Filtrar es cosa de la vista.
     */
    function multiAttackDistribution(cfg, ac) {
        const n = cfg.numberOfAttacks;
        const { hit: pHit, crit: pCrit } = hitProbability(cfg, ac);
        const pMiss = 1 - pHit;
        const pNormal = pHit - pCrit;

        const normalAvg = damageAverage(cfg, false, false);
        const critAvg = damageAverage(cfg, true, false);
        const normalRange = damageRange(cfg, false, false);
        const critRange = damageRange(cfg, true, false);

        const groups = [];
        for (let hits = 0; hits <= n; hits++) {
            const combinations = [];
            for (let crits = 0; crits <= hits; crits++) {
                const normals = hits - crits;
                const misses = n - hits;
                const probability = multinomial(n, misses, normals, crits)
                    * Math.pow(pMiss, misses)
                    * Math.pow(pNormal, normals)
                    * Math.pow(pCrit, crits);

                let saAvg = 0, saMin = 0, saMax = 0;
                if (cfg.sneakAttackDice > 0 && hits >= 1) {
                    const isCrit = crits >= 1;
                    saAvg = sneakAttackAverage(cfg, isCrit);
                    ({ min: saMin, max: saMax } = sneakAttackRange(cfg, isCrit));
                }

                combinations.push({
                    normals,
                    crits,
                    probability,
                    damage: normals * normalAvg + crits * critAvg + saAvg,
                    damageMin: normals * normalRange.min + crits * critRange.min + saMin,
                    damageMax: normals * normalRange.max + crits * critRange.max + saMax
                });
            }
            groups.push({
                totalHits: hits,
                combinations,
                totalProbability: combinations.reduce((s, c) => s + c.probability, 0)
            });
        }
        return groups;
    }

    return {
        ADVANTAGE_MODES,
        normalizeConfig,
        hitProbability,
        damageAverage,
        damageRange,
        sneakAttackAverage,
        sneakAttackRange,
        dprPerAttack,
        sneakAttackPerTurn,
        dprPerTurn,
        withPowerAttack,
        powerAttackComparison,
        powerAttackCutoff,
        multiAttackDistribution
    };
}));
