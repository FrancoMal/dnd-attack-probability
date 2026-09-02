// Oráculo de fuerza bruta: enumera TODAS las combinaciones de dados y cuenta
// impactos/críticos aplicando las reglas de D&D 5e literalmente.
// Se usa como "verdad" contra la que se valida el motor.

function oracleHit({ attackBonus, critRange, advantage, attackDiceBonus = 0 }, ac) {
    const targetRoll = ac - attackBonus;
    const bonusSides = attackDiceBonus || 1; // 1 => un solo resultado con valor 0
    let hit = 0, crit = 0, total = 0;

    for (let d1 = 1; d1 <= 20; d1++) {
        for (let d2 = 1; d2 <= 20; d2++) {
            if (advantage === 'normal' && d2 !== 1) continue; // un solo d20
            for (let b = 1; b <= bonusSides; b++) {
                const bonus = attackDiceBonus ? b : 0;
                total++;

                let d20;
                if (advantage === 'advantage') d20 = Math.max(d1, d2);
                else if (advantage === 'disadvantage') d20 = Math.min(d1, d2);
                else d20 = d1;

                if (d20 === 1) continue;            // 1 natural: fallo automático
                if (d20 >= critRange) { crit++; hit++; continue; } // crítico: siempre impacta
                if (d20 + bonus >= targetRoll) hit++;
            }
        }
    }
    return { hit: hit / total, crit: crit / total, miss: 1 - hit / total };
}

module.exports = { oracleHit };
