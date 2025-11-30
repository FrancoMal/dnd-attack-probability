# ⚔️ Calculadora de Probabilidades de Ataque D&D

## 🇪🇸 Español

### ¿Qué es esto?

Una calculadora de probabilidades de combate para Dungeons & Dragons 5e inspirada en Baldur's Gate 3. Calcula las probabilidades exactas de impactar, hacer crítico y el daño esperado contra cualquier enemigo.

### Características principales

- **Tabla completa de probabilidades**: Ve tus probabilidades de impacto contra CAs del 1 al 30
- **Ventaja/Desventaja**: Cálculos precisos con mecánica de 2d20
- **Rango crítico configurable**: 20, 19-20 o 18-20
- **Múltiples dados**: Soporta combinaciones complejas (2d6+1d4+3, etc.)
- **Múltiples ataques**: Calcula probabilidades de hacer 0, 1, 2... n impactos
- **Distribución de críticos**: Ve cuántos de tus impactos serán críticos
- **Rangos de daño**: Muestra daño mínimo-máximo para cada escenario
- **Tooltips informativos**: Explicaciones de todos los términos técnicos

### Cómo usar

1. Abre `calculator-standalone.html` en cualquier navegador o https://francomal.github.io/dnd-attack-probability/
2. Configura tu personaje:
   - Bonificador de ataque (+5, +8, etc.)
   - Dados de daño (1d8, 2d6, etc.)
   - Bonificador de daño
3. Selecciona ventaja/desventaja si aplica
4. Ajusta número de ataques
5. (Opcional) Especifica CA objetivo
6. Haz clic en "Calcular Probabilidades"

### Archivos

- **`calculator-standalone.html`**: Todo en un solo archivo (recomendado)
- **`index.html`** + **`styles.css`** + **`calculator.js`**: Versión modular

### Matemáticas

Utiliza distribución multinomial para cálculos precisos:
- Ventaja: P(max ≥ x) = 1 - ((x-1)/20)²
- Desventaja: P(min ≥ x) = ((21-x)/20)²
- Múltiples ataques: P(f,n,c) = (n!/(f!×n!×c!)) × p_fallo^f × p_normal^n × p_crítico^c

---

## 🇬🇧 English

### What is this?

A combat probability calculator for Dungeons & Dragons 5e inspired by Baldur's Gate 3. It calculates exact probabilities of hitting, critical strikes, and expected damage against any enemy.

### Main Features

- **Complete probability table**: See your hit chances against AC 1 to 30
- **Advantage/Disadvantage**: Precise calculations with 2d20 mechanics
- **Configurable critical range**: 20, 19-20, or 18-20
- **Multiple dice**: Supports complex combinations (2d6+1d4+3, etc.)
- **Multiple attacks**: Calculate probabilities of landing 0, 1, 2... n hits
- **Critical distribution**: See how many of your hits will be critical
- **Damage ranges**: Shows minimum-maximum damage for each scenario
- **Informative tooltips**: Explanations for all technical terms

### How to Use

1. Open `calculator-standalone.html` in any browser or https://francomal.github.io/dnd-attack-probability/
2. Configure your character:
   - Attack bonus (+5, +8, etc.)
   - Damage dice (1d8, 2d6, etc.)
   - Damage bonus
3. Select advantage/disadvantage if applicable
4. Adjust number of attacks
5. (Optional) Specify target AC
6. Click "Calculate Probabilities"

### Files

- **`calculator-standalone.html`**: Everything in one file (recommended)
- **`index.html`** + **`styles.css`** + **`calculator.js`**: Modular version

### Mathematics

Uses multinomial distribution for precise calculations:
- Advantage: P(max ≥ x) = 1 - ((x-1)/20)²
- Disadvantage: P(min ≥ x) = ((21-x)/20)²
- Multiple attacks: P(f,n,c) = (n!/(f!×n!×c!)) × p_miss^f × p_normal^n × p_crit^c

---

## 🎲 Example

**Character setup:**
- Attack bonus: +5
- Damage: 1d8 + 3
- Advantage: Yes
- Attacks: 3

**Against AC 15:**
- Hit chance per attack: 79.8%
- Critical chance per attack: 9.8%
- Expected damage: 19.3 per round
- 50.6% chance to hit all 3 attacks

**Click on distribution groups to see detailed critical breakdowns!**

---

Made with D&D 5e rules and Baldur's Gate 3 mechanics
