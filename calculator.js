// Calculadora de probabilidades D&D
class DnDCalculator {
    constructor() {
        this.config = {
            attackBonus: 5,
            damageBonus: 3,
            damageDice: [{ count: 1, sides: 8 }],
            advantage: 'normal',
            critRange: 20,
            numberOfAttacks: 1,
            targetAC: null
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Inputs numéricos
        document.getElementById('attackBonus').addEventListener('input', (e) => {
            this.config.attackBonus = parseInt(e.target.value) || 0;
        });

        document.getElementById('damageBonus').addEventListener('input', (e) => {
            this.config.damageBonus = parseInt(e.target.value) || 0;
        });

        document.getElementById('critRange').addEventListener('change', (e) => {
            this.config.critRange = parseInt(e.target.value);
        });

        document.getElementById('targetAC').addEventListener('input', (e) => {
            this.config.targetAC = e.target.value ? parseInt(e.target.value) : null;
        });

        // Ventaja/Desventaja
        document.querySelectorAll('input[name="advantage"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.config.advantage = e.target.value;
            });
        });

        // Número de ataques
        const attacksSlider = document.getElementById('numberOfAttacks');
        const attacksValue = document.getElementById('attacksValue');
        attacksSlider.addEventListener('input', (e) => {
            this.config.numberOfAttacks = parseInt(e.target.value);
            attacksValue.textContent = e.target.value;
        });

        // Dados - delegación de eventos
        document.getElementById('diceList').addEventListener('input', () => {
            this.updateDiceFromInputs();
        });
    }

    updateDiceFromInputs() {
        const diceItems = document.querySelectorAll('.dice-item');
        this.config.damageDice = [];

        diceItems.forEach(item => {
            const count = parseInt(item.querySelector('.dice-count').value) || 1;
            const sides = parseInt(item.querySelector('.dice-sides').value);
            this.config.damageDice.push({ count, sides });
        });

        this.updateDiceNotation();
    }

    updateDiceNotation() {
        const notation = this.config.damageDice
            .map(d => `${d.count}d${d.sides}`)
            .join(' + ');

        const fullNotation = this.config.damageBonus > 0
            ? `${notation} + ${this.config.damageBonus}`
            : notation;

        document.getElementById('diceNotation').textContent = fullNotation;
    }

    // ========== CÁLCULO DE PROBABILIDADES ==========

    calculateHitChance(ac) {
        const targetRoll = ac - this.config.attackBonus;
        const critMin = this.config.critRange;

        if (this.config.advantage === 'normal') {
            return this.calculateNormalProbability(targetRoll, critMin);
        } else if (this.config.advantage === 'advantage') {
            return this.calculateAdvantageProbability(targetRoll, critMin);
        } else {
            return this.calculateDisadvantageProbability(targetRoll, critMin);
        }
    }

    calculateNormalProbability(targetRoll, critMin) {
        // Caso: crítico siempre impacta (incluso si necesitas 21+)
        if (targetRoll >= 21) {
            const critChance = (21 - critMin) / 20;
            return {
                hit: critChance,
                crit: critChance,
                miss: 1 - critChance
            };
        }

        // Caso: siempre impactas (excepto con 1, que es fallo automático)
        if (targetRoll <= 1) {
            const critChance = (21 - critMin) / 20;
            return {
                hit: 0.95, // todo excepto el 1
                crit: critChance,
                miss: 0.05
            };
        }

        // Caso normal
        const hitRolls = 21 - targetRoll; // resultados que son hit
        const critRolls = 21 - critMin;   // resultados que son crítico

        return {
            hit: hitRolls / 20,
            crit: critRolls / 20,
            miss: (targetRoll - 1) / 20
        };
    }

    calculateAdvantageProbability(targetRoll, critMin) {
        // Con ventaja: P(max >= x) = 1 - P(ambos < x) = 1 - ((x-1)/20)²

        let pHit, pCrit;

        if (targetRoll >= 21) {
            // Solo crítico puede impactar
            pCrit = 1 - ((critMin - 1) / 20) ** 2;
            pHit = pCrit;
        } else if (targetRoll <= 1) {
            // Casi todo impacta (excepto doble 1)
            pHit = 1 - (1 / 20) ** 2; // 1 - 0.0025 = 0.9975
            pCrit = 1 - ((critMin - 1) / 20) ** 2;
        } else {
            pHit = 1 - ((targetRoll - 1) / 20) ** 2;
            pCrit = 1 - ((critMin - 1) / 20) ** 2;
        }

        return {
            hit: pHit,
            crit: pCrit,
            miss: 1 - pHit
        };
    }

    calculateDisadvantageProbability(targetRoll, critMin) {
        // Con desventaja: P(min >= x) = ((21-x)/20)²

        let pHit, pCrit;

        if (targetRoll >= 21) {
            // Solo crítico puede impactar
            pCrit = ((21 - critMin) / 20) ** 2;
            pHit = pCrit;
        } else if (targetRoll <= 1) {
            // Siempre impactas excepto con doble 1
            pHit = 1 - (1 / 20) ** 2;
            pCrit = ((21 - critMin) / 20) ** 2;
        } else {
            pHit = ((21 - targetRoll) / 20) ** 2;
            pCrit = ((21 - critMin) / 20) ** 2;
        }

        return {
            hit: pHit,
            crit: pCrit,
            miss: 1 - pHit
        };
    }

    // ========== CÁLCULO DE DAÑO ==========

    calculateAverageDamage(isCrit = false) {
        let avgDice = 0;

        this.config.damageDice.forEach(die => {
            const avgPerDie = (1 + die.sides) / 2;
            const multiplier = isCrit ? die.count * 2 : die.count;
            avgDice += multiplier * avgPerDie;
        });

        // El bonificador NO se duplica en crítico
        return avgDice + this.config.damageBonus;
    }

    calculateDamageRange(isCrit = false) {
        let min = 0;
        let max = 0;

        this.config.damageDice.forEach(die => {
            const multiplier = isCrit ? die.count * 2 : die.count;
            min += multiplier * 1;
            max += multiplier * die.sides;
        });

        return {
            min: min + this.config.damageBonus,
            max: max + this.config.damageBonus
        };
    }

    calculateExpectedDPR(hitChance, critChance) {
        const normalDmg = this.calculateAverageDamage(false);
        const critDmg = this.calculateAverageDamage(true);

        // DPR = P(hit normal) × daño_normal + P(crit) × daño_crítico
        const pNormalHit = hitChance - critChance;
        const dpr = pNormalHit * normalDmg + critChance * critDmg;

        return dpr;
    }

    // ========== MÚLTIPLES ATAQUES ==========

    calculateMultiAttackDistribution(ac) {
        const n = this.config.numberOfAttacks;
        const { hit: pHit, crit: pCrit } = this.calculateHitChance(ac);

        const pMiss = 1 - pHit;
        const pNormal = pHit - pCrit;

        const normalDmg = this.calculateAverageDamage(false);
        const critDmg = this.calculateAverageDamage(true);

        // Obtener rangos de daño
        const normalRange = this.calculateDamageRange(false);
        const critRange = this.calculateDamageRange(true);

        const results = [];

        // Para cada número total de hits
        for (let totalHits = 0; totalHits <= n; totalHits++) {
            const hitCombinations = [];

            // Para cada combinación de críticos dentro de los hits
            for (let crits = 0; crits <= totalHits; crits++) {
                const normals = totalHits - crits;
                const misses = n - totalHits;

                // Probabilidad multinomial
                const prob = this.multinomialCoeff(n, misses, normals, crits) *
                            Math.pow(pMiss, misses) *
                            Math.pow(pNormal, normals) *
                            Math.pow(pCrit, crits);

                // Daño para esta combinación (promedio y rango)
                const avgDamage = normals * normalDmg + crits * critDmg;
                const minDamage = normals * normalRange.min + crits * critRange.min;
                const maxDamage = normals * normalRange.max + crits * critRange.max;

                // Solo incluir si probabilidad > 0.1%
                if (prob > 0.001) {
                    hitCombinations.push({
                        normals: normals,
                        crits: crits,
                        probability: prob,
                        damage: avgDamage,
                        damageMin: minDamage,
                        damageMax: maxDamage
                    });
                }
            }

            // Calcular probabilidad total para este número de hits
            const totalProbability = hitCombinations.reduce((sum, c) => sum + c.probability, 0);

            results.push({
                totalHits: totalHits,
                combinations: hitCombinations,
                totalProbability: totalProbability
            });
        }

        return results;
    }

    multinomialCoeff(n, k1, k2, k3) {
        return this.factorial(n) / (this.factorial(k1) * this.factorial(k2) * this.factorial(k3));
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    binomial(n, k) {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;

        // Optimización: usar la mitad más pequeña
        k = Math.min(k, n - k);

        let result = 1;
        for (let i = 0; i < k; i++) {
            result *= (n - i);
            result /= (i + 1);
        }

        return result;
    }

    // ========== GENERACIÓN DE UI ==========

    calculate() {
        const resultsBody = document.getElementById('resultsBody');
        const rollRequirement = document.getElementById('rollRequirement');
        const multiAttackPanel = document.getElementById('multiAttackPanel');

        // Limpiar resultados previos
        resultsBody.innerHTML = '';

        // Calcular para CAs del 1 al 30
        const minAC = 1;
        const maxAC = 30;

        for (let ac = minAC; ac <= maxAC; ac++) {
            const { hit, crit, miss } = this.calculateHitChance(ac);
            const dpr = this.calculateExpectedDPR(hit, crit);

            // Calcular rangos de daño
            const normalRange = this.calculateDamageRange(false);
            const critRange = this.calculateDamageRange(true);

            const row = document.createElement('tr');

            // Destacar CA objetivo
            if (this.config.targetAC && ac === this.config.targetAC) {
                row.classList.add('highlighted');
            }

            row.innerHTML = `
                <td><strong>${ac}</strong></td>
                <td class="value-miss">${(miss * 100).toFixed(1)}%</td>
                <td class="value-hit">${((hit - crit) * 100).toFixed(1)}%</td>
                <td class="value-crit">${(crit * 100).toFixed(1)}%</td>
                <td class="value-damage">${normalRange.min}-${normalRange.max}</td>
                <td class="value-damage">${critRange.min}-${critRange.max}</td>
                <td class="value-dpr">${dpr.toFixed(2)}</td>
                <td>
                    <div class="prob-bar">
                        ${miss > 0.01 ? `<div class="bar-segment bar-miss" style="width: ${miss * 100}%"></div>` : ''}
                        ${(hit - crit) > 0.01 ? `<div class="bar-segment bar-hit" style="width: ${(hit - crit) * 100}%"></div>` : ''}
                        ${crit > 0.01 ? `<div class="bar-segment bar-crit" style="width: ${crit * 100}%"></div>` : ''}
                    </div>
                </td>
            `;

            resultsBody.appendChild(row);
        }

        // Mostrar información del roll requerido
        if (this.config.targetAC) {
            const targetRoll = this.config.targetAC - this.config.attackBonus;
            let requirementText = '';

            if (targetRoll <= 1) {
                requirementText = `<strong>CA ${this.config.targetAC}:</strong> Impactas automáticamente (excepto con 1 natural)`;
            } else if (targetRoll >= 21) {
                requirementText = `<strong>CA ${this.config.targetAC}:</strong> Solo puedes impactar con crítico natural`;
            } else {
                requirementText = `<strong>CA ${this.config.targetAC}:</strong> Necesitas sacar <strong>${targetRoll}</strong> o más en el d20`;
            }

            const normalDmg = this.calculateAverageDamage(false);
            const critDmg = this.calculateAverageDamage(true);
            const normalRange = this.calculateDamageRange(false);
            const critRange = this.calculateDamageRange(true);

            requirementText += `<br><strong>Daño normal:</strong> ${normalRange.min}-${normalRange.max} (promedio ${normalDmg.toFixed(1)})`;
            requirementText += `<br><strong>Daño crítico:</strong> ${critRange.min}-${critRange.max} (promedio ${critDmg.toFixed(1)})`;

            rollRequirement.innerHTML = requirementText;
        } else {
            rollRequirement.innerHTML = '<strong>Consejo:</strong> Especifica una CA objetivo para ver los requisitos de tirada';
        }

        // Múltiples ataques
        if (this.config.numberOfAttacks > 1) {
            multiAttackPanel.style.display = 'block';
            this.renderMultiAttackDistribution();
        } else {
            multiAttackPanel.style.display = 'none';
        }
    }

    renderMultiAttackDistribution() {
        const targetAC = this.config.targetAC || 15;
        const distribution = this.calculateMultiAttackDistribution(targetAC);
        const distributionDiv = document.getElementById('multiAttackDistribution');
        const infoDiv = document.getElementById('multiAttackInfo');

        // Texto de ventaja/desventaja
        const advantageText = this.config.advantage === 'advantage' ? ' <strong style="color: var(--color-hit);">(CON VENTAJA)</strong>' :
                              this.config.advantage === 'disadvantage' ? ' <strong style="color: var(--color-miss);">(CON DESVENTAJA)</strong>' :
                              '';

        // Calcular resumen de daño total
        const normalRange = this.calculateDamageRange(false);
        const critRange = this.calculateDamageRange(true);
        const n = this.config.numberOfAttacks;

        const allNormalsMin = n * normalRange.min;
        const allNormalsMax = n * normalRange.max;
        const allCritsMin = n * critRange.min;
        const allCritsMax = n * critRange.max;

        // Información general
        const { hit: pHit, crit: pCrit } = this.calculateHitChance(targetAC);
        infoDiv.innerHTML = `
            <strong>Contra CA ${targetAC} con ${this.config.numberOfAttacks} ataques${advantageText}:</strong><br>
            Probabilidad de impacto por ataque: ${(pHit * 100).toFixed(1)}%<br>
            Probabilidad de crítico por ataque: ${(pCrit * 100).toFixed(1)}%<br>
            <br>
            <strong style="color: var(--color-crit);">📊 Resumen de daño total:</strong><br>
            <span style="color: var(--text-secondary);">
                • Si todos impactan (sin críticos): <strong style="color: var(--color-hit);">${allNormalsMin}-${allNormalsMax} daño</strong><br>
                • Si todos impactan con críticos: <strong style="color: var(--color-crit);">${allCritsMin}-${allCritsMax} daño</strong><br>
                • Rango total posible: <strong style="color: var(--text-primary);">0-${allCritsMax} daño</strong>
            </span><br>
            <br>
            <em style="color: var(--text-muted); font-size: 0.9em;">Haz clic en cada grupo para ver el desglose detallado de críticos</em>
        `;

        // Distribución con grupos expandibles
        distributionDiv.innerHTML = '';

        distribution.forEach(({ totalHits, combinations, totalProbability }) => {
            if (totalProbability < 0.001) return; // Ignorar probabilidades muy bajas

            const group = document.createElement('div');
            group.className = 'distribution-group';

            // Header del grupo
            const header = document.createElement('div');
            header.className = 'dist-header';
            header.innerHTML = `
                <span class="dist-hits">${totalHits} ${totalHits === 1 ? 'impacto' : 'impactos'}</span>
                <span class="dist-total-prob">${(totalProbability * 100).toFixed(1)}%</span>
                <button class="expand-btn">▼</button>
            `;

            // Detalles expandibles (combinaciones de críticos)
            const details = document.createElement('div');
            details.className = 'dist-details';

            combinations.forEach(({ normals, crits, probability, damage, damageMin, damageMax }) => {
                const combo = document.createElement('div');
                combo.className = 'dist-combo';

                const label = normals === 0 && crits === 0
                    ? 'Sin impactos'
                    : `${normals} ${normals === 1 ? 'normal' : 'normales'}, ${crits} ${crits === 1 ? 'crítico' : 'críticos'}`;

                // Formatear display de daño
                const damageDisplay = damageMin === damageMax
                    ? `${damageMin} daño`
                    : `${damageMin}-${damageMax} daño <span style="color: var(--text-muted); font-size: 0.85em;">(avg: ${damage.toFixed(1)})</span>`;

                combo.innerHTML = `
                    <span class="combo-label">${label}</span>
                    <div class="combo-bar" style="width: ${Math.max((probability / totalProbability) * 100, 2)}%" data-percent="${(probability * 100).toFixed(1)}%"></div>
                    <span class="combo-damage">${damageDisplay}</span>
                `;

                details.appendChild(combo);
            });

            // Event listener para expandir/colapsar
            header.addEventListener('click', () => {
                const btn = header.querySelector('.expand-btn');
                details.classList.toggle('expanded');
                btn.classList.toggle('expanded');
            });

            group.appendChild(header);
            group.appendChild(details);
            distributionDiv.appendChild(group);
        });
    }
}

// ========== HELPERS GLOBALES ==========

function addDice() {
    const diceList = document.getElementById('diceList');

    const diceItem = document.createElement('div');
    diceItem.className = 'dice-item';
    diceItem.innerHTML = `
        <input type="number" class="dice-count" value="1" min="1" max="10">
        <span>d</span>
        <select class="dice-sides">
            <option value="4">4</option>
            <option value="6" selected>6</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="20">20</option>
            <option value="100">100</option>
        </select>
        <button class="btn-remove" onclick="removeDice(this)">×</button>
    `;

    diceList.appendChild(diceItem);
    calculator.updateDiceFromInputs();
}

function removeDice(button) {
    const diceList = document.getElementById('diceList');

    // No permitir eliminar el último dado
    if (diceList.children.length <= 1) {
        alert('Debes tener al menos un dado de daño');
        return;
    }

    button.parentElement.remove();
    calculator.updateDiceFromInputs();
}

// ========== INICIALIZACIÓN ==========

let calculator;

document.addEventListener('DOMContentLoaded', () => {
    calculator = new DnDCalculator();
    calculator.updateDiceNotation();

    // Calcular automáticamente al cargar
    calculator.calculate();
});
