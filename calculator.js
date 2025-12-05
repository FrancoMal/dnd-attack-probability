// ========== SISTEMA DE INTERNACIONALIZACIÓN ==========

// Current language (auto-detect or from localStorage)
let currentLanguage = 'es';

// Translation object with all supported languages
const translations = {
    es: {
        // Header
        title: "⚔️ Calculadora de Probabilidades de Ataque D&D",
        subtitle: "Calcula tus probabilidades de impacto y daño esperado",

        // Config panel
        configTitle: "⚙️ Configuración de Ataque",
        attackBonus: "Bonificador de Ataque",
        attackBonusTooltip: "Tu modificador de ataque total (ej: +5)",
        damageBonus: "Bonificador de Daño",
        damageBonusTooltip: "Modificador que se suma al daño (ej: +3)",
        damageDice: "Dados de Daño",
        addDice: "+ Añadir Dado",
        critRange: "Rango Crítico",
        critRange20: "Solo 20 (5%)",
        critRange19: "19-20 (10%)",
        critRange18: "18-20 (15%)",
        advantageLabel: "Ventaja / Desventaja",
        disadvantage: "Desventaja",
        normal: "Normal",
        advantage: "Ventaja",
        numberOfAttacks: "Número de Ataques",
        targetAC: "CA Objetivo (Opcional)",
        targetACTooltip: "Clase de Armadura del enemigo específico a destacar",
        targetACPlaceholder: "Ej: 15",
        calculateButton: "🎲 Calcular Probabilidades",

        // Results panel
        resultsTitle: "📊 Tabla de Probabilidades",
        tableHeaderAC: "CA",
        tableHeaderACTooltip: "Clase de Armadura del enemigo",
        tableHeaderMiss: "Fallo",
        tableHeaderMissTooltip: "Probabilidad de no impactar (incluso con 1 natural)",
        tableHeaderHit: "Impacto",
        tableHeaderHitTooltip: "Probabilidad de impacto normal (sin crítico)",
        tableHeaderCrit: "Crítico",
        tableHeaderCritTooltip: "Probabilidad de crítico (duplica dados de daño)",
        tableHeaderNormalDmg: "Daño Normal",
        tableHeaderNormalDmgTooltip: "Rango de daño si impactas sin crítico",
        tableHeaderCritDmg: "Daño Crítico",
        tableHeaderCritDmgTooltip: "Rango de daño con impacto crítico",
        tableHeaderDPR: "DPR",
        tableHeaderDPRTooltip: "Damage Per Round: daño promedio esperado por turno considerando todas las probabilidades",
        tableHeaderViz: "Visualización",
        noData: "Haz clic en \"Calcular Probabilidades\" para ver los resultados",

        // Roll requirement messages
        rollReqAuto: "<strong>CA {{ac}}:</strong> Impactas automáticamente (excepto con 1 natural)",
        rollReqCritOnly: "<strong>CA {{ac}}:</strong> Solo puedes impactar con crítico natural",
        rollReqNormal: "<strong>CA {{ac}}:</strong> Necesitas sacar <strong>{{roll}}</strong> o más en el d20",
        rollReqAdvice: "<strong>Consejo:</strong> Especifica una CA objetivo para ver los requisitos de tirada",
        damageNormal: "<br><strong>Daño normal:</strong> {{min}}-{{max}} (promedio {{avg}})",
        damageCrit: "<br><strong>Daño crítico:</strong> {{min}}-{{max}} (promedio {{avg}})",

        // Multi-attack panel
        multiAttackTitle: "🎯 Distribución de Múltiples Ataques",
        multiAttackWith: "Contra CA {{ac}} con {{n}} ataques",
        multiAttackAdvantage: " <strong style=\"color: var(--color-hit);\">(CON VENTAJA)</strong>",
        multiAttackDisadvantage: " <strong style=\"color: var(--color-miss);\">(CON DESVENTAJA)</strong>",
        multiAttackHitProb: "Probabilidad de impacto por ataque: {{prob}}%",
        multiAttackCritProb: "Probabilidad de crítico por ataque: {{prob}}%",
        multiAttackSummary: "<strong style=\"color: var(--color-crit);\">📊 Resumen de daño total:</strong>",
        multiAttackAllNormal: "• Si todos impactan (sin críticos): <strong style=\"color: var(--color-hit);\">{{min}}-{{max}} daño</strong>",
        multiAttackAllCrit: "• Si todos impactan con críticos: <strong style=\"color: var(--color-crit);\">{{min}}-{{max}} daño</strong>",
        multiAttackRange: "• Rango total posible: <strong style=\"color: var(--text-primary);\">0-{{max}} daño</strong>",
        multiAttackHint: "<em style=\"color: var(--text-muted); font-size: 0.9em;\">Haz clic en cada grupo para ver el desglose detallado de críticos</em>",

        // Distribution labels
        hits_singular: "impacto",
        hits_plural: "impactos",
        normal_singular: "normal",
        normal_plural: "normales",
        crit_singular: "crítico",
        crit_plural: "críticos",
        noHits: "Sin impactos",
        damage: "daño",
        damageAvg: "(promedio: {{avg}})",

        // Legend
        legendMiss: "Fallo",
        legendHit: "Impacto Normal",
        legendCrit: "Crítico",
        legendDPR: "DPR = Damage Per Round (daño promedio esperado)",

        // Footer
        footerText: "Calculadora basada en las reglas de D&D 5e",

        // Alerts
        alertMinDice: "Debes tener al menos un dado de daño",

        // Combat Statistics
        combatStatsTitle: "📊 Estadísticas de Combate",
        vsAC: "contra CA",
        statDPRTotal: "DPR Total",
        statHitProb: "Prob. Impacto",
        statDamagePerHit: "Daño/Impacto",
        statCritsPerRound: "Críticos/Turno",
        damagePerRound: "daño/turno",
        average: "promedio",
        defeatTimesTitle: "⏱️ Turnos para Derrotar",
        enemyWeak: "Enemigo débil (20 HP)",
        enemyNormal: "Enemigo normal (50 HP)",
        enemyStrong: "Enemigo fuerte (100 HP)",
        enemyBoss: "Jefe (200 HP)",
        turnsLabel: "turnos",
        levelExplanation: "Basado en DPR y bonificador de ataque",
        levelRange: "Nivel",

        // Power Level
        powerLevelTitle: "⚡ Nivel de Poder del Personaje",
        powerLevelLabel: "Power Level",
        howCalculated: "📊 Cómo se calcula:",
        whyTheseFactors: "¿Por qué estos factores?",
        dprTotalExplain: "Incluye ventaja, críticos y múltiples ataques",
        hitChanceExplain: "Penaliza builds poco confiables",
        scaleExplain: "Escala para números comparables",

        // Profiles
        profilesTitle: "📁 Perfiles Guardados",
        profileNamePlaceholder: "Nombre del perfil...",
        saveProfileBtn: "💾 Guardar Perfil",
        loadProfileTooltip: "Cargar este perfil",
        deleteProfileTooltip: "Eliminar este perfil",
        noProfiles: "No hay perfiles guardados",
        confirmDeleteProfile: "¿Eliminar el perfil '{{name}}'?",
        profileSaved: "Perfil '{{name}}' guardado",
        profileLoaded: "Perfil '{{name}}' cargado",
        profileDeleted: "Perfil eliminado",
        profileNameRequired: "Ingresa un nombre para el perfil",
        profileWithAdvantage: "Ventaja",
        profileWithDisadvantage: "Desventaja",
        profileAttacks: "{{n}} ataques",

        // Profile Comparison
        compareTitle: "⚔️ Comparar Perfiles",
        compareSelectProfiles: "Selecciona perfiles a comparar:",
        compareTargetAC: "CA para comparar",
        compareButton: "📊 Comparar",
        compareMinSelect: "Selecciona al menos 2 perfiles para comparar",
        compareNoProfiles: "Guarda perfiles primero para compararlos",
        compareResultsTitle: "📊 Comparación de Perfiles",
        compareVsAC: "contra CA",
        comparePowerLevel: "Power Level",
        compareHitChance: "Prob. Impacto",
        compareCritChance: "Prob. Crítico",
        compareRollNeeded: "Roll Mínimo",
        compareNormalDmg: "Daño Normal",
        compareCritDmg: "Daño Crítico",
        compareDPR: "DPR Total",
        compareAttacks: "Ataques",
        compareBest: "MEJOR",
        compareAutoHit: "Auto",
        compareCritOnly: "Solo Crit",
        compareAdvantage: "Vent.",
        compareDisadvantage: "Desv.",
        compareDice: "Tiradas",
        compareAttackBonus: "Bono Ataque",

        // Profile Editing
        editProfile: "Editar",
        editingProfile: "Editando:",
        updateProfile: "Actualizar Perfil",
        cancelEdit: "Cancelar",

        // Attack Dice Bonus
        attackDiceBonus: "Dado Extra al Ataque",
        attackDiceBonusTooltip: "Dado adicional para tiradas de ataque (ej: Bendición, Inspiración Bárdica)",
        attackDiceBonusNone: "Ninguno",
        attackDiceBonusBless: "+1d4 (Bendición)",
        attackDiceBonusBardic6: "+1d6 (Inspiración)",
        attackDiceBonusBardic8: "+1d8 (Inspiración)",
        attackDiceBonusBardic10: "+1d10 (Inspiración)",
        attackDiceBonusBardic12: "+1d12 (Inspiración)",
        profileWithAttackDice: "+1d{{sides}}",
        compareAttackDice: "Dado Extra"
    },

    en: {
        // Header
        title: "⚔️ D&D Attack Probability Calculator",
        subtitle: "Calculate your hit probabilities and expected damage",

        // Config panel
        configTitle: "⚙️ Attack Configuration",
        attackBonus: "Attack Bonus",
        attackBonusTooltip: "Your total attack modifier (e.g., +5)",
        damageBonus: "Damage Bonus",
        damageBonusTooltip: "Modifier added to damage (e.g., +3)",
        damageDice: "Damage Dice",
        addDice: "+ Add Die",
        critRange: "Critical Range",
        critRange20: "Only 20 (5%)",
        critRange19: "19-20 (10%)",
        critRange18: "18-20 (15%)",
        advantageLabel: "Advantage / Disadvantage",
        disadvantage: "Disadvantage",
        normal: "Normal",
        advantage: "Advantage",
        numberOfAttacks: "Number of Attacks",
        targetAC: "Target AC (Optional)",
        targetACTooltip: "Armor Class of specific enemy to highlight",
        targetACPlaceholder: "e.g., 15",
        calculateButton: "🎲 Calculate Probabilities",

        // Results panel
        resultsTitle: "📊 Probability Table",
        tableHeaderAC: "AC",
        tableHeaderACTooltip: "Enemy Armor Class",
        tableHeaderMiss: "Miss",
        tableHeaderMissTooltip: "Probability of missing (even with natural 1)",
        tableHeaderHit: "Hit",
        tableHeaderHitTooltip: "Probability of normal hit (non-critical)",
        tableHeaderCrit: "Critical",
        tableHeaderCritTooltip: "Probability of critical hit (doubles damage dice)",
        tableHeaderNormalDmg: "Normal Damage",
        tableHeaderNormalDmgTooltip: "Damage range on non-critical hit",
        tableHeaderCritDmg: "Critical Damage",
        tableHeaderCritDmgTooltip: "Damage range on critical hit",
        tableHeaderDPR: "DPR",
        tableHeaderDPRTooltip: "Damage Per Round: expected average damage per turn considering all probabilities",
        tableHeaderViz: "Visualization",
        noData: "Click \"Calculate Probabilities\" to see results",

        // Roll requirement messages
        rollReqAuto: "<strong>AC {{ac}}:</strong> Auto-hit (except on natural 1)",
        rollReqCritOnly: "<strong>AC {{ac}}:</strong> Can only hit with natural critical",
        rollReqNormal: "<strong>AC {{ac}}:</strong> You need to roll <strong>{{roll}}</strong> or higher on the d20",
        rollReqAdvice: "<strong>Tip:</strong> Specify a target AC to see roll requirements",
        damageNormal: "<br><strong>Normal damage:</strong> {{min}}-{{max}} (average {{avg}})",
        damageCrit: "<br><strong>Critical damage:</strong> {{min}}-{{max}} (average {{avg}})",

        // Multi-attack panel
        multiAttackTitle: "🎯 Multiple Attacks Distribution",
        multiAttackWith: "Against AC {{ac}} with {{n}} attacks",
        multiAttackAdvantage: " <strong style=\"color: var(--color-hit);\">(WITH ADVANTAGE)</strong>",
        multiAttackDisadvantage: " <strong style=\"color: var(--color-miss);\">(WITH DISADVANTAGE)</strong>",
        multiAttackHitProb: "Hit probability per attack: {{prob}}%",
        multiAttackCritProb: "Critical probability per attack: {{prob}}%",
        multiAttackSummary: "<strong style=\"color: var(--color-crit);\">📊 Total damage summary:</strong>",
        multiAttackAllNormal: "• If all hit (no crits): <strong style=\"color: var(--color-hit);\">{{min}}-{{max}} damage</strong>",
        multiAttackAllCrit: "• If all hit critically: <strong style=\"color: var(--color-crit);\">{{min}}-{{max}} damage</strong>",
        multiAttackRange: "• Total possible range: <strong style=\"color: var(--text-primary);\">0-{{max}} damage</strong>",
        multiAttackHint: "<em style=\"color: var(--text-muted); font-size: 0.9em;\">Click on each group to see detailed critical breakdown</em>",

        // Distribution labels
        hits_singular: "hit",
        hits_plural: "hits",
        normal_singular: "normal",
        normal_plural: "normal",
        crit_singular: "critical",
        crit_plural: "criticals",
        noHits: "No hits",
        damage: "damage",
        damageAvg: "(avg: {{avg}})",

        // Legend
        legendMiss: "Miss",
        legendHit: "Normal Hit",
        legendCrit: "Critical",
        legendDPR: "DPR = Damage Per Round (expected average damage)",

        // Footer
        footerText: "Calculator based on D&D 5e rules",

        // Alerts
        alertMinDice: "You must have at least one damage die",

        // Combat Statistics
        combatStatsTitle: "📊 Combat Statistics",
        vsAC: "vs AC",
        statDPRTotal: "Total DPR",
        statHitProb: "Hit Prob.",
        statDamagePerHit: "Damage/Hit",
        statCritsPerRound: "Crits/Round",
        damagePerRound: "damage/round",
        average: "average",
        defeatTimesTitle: "⏱️ Turns to Defeat",
        enemyWeak: "Weak enemy (20 HP)",
        enemyNormal: "Normal enemy (50 HP)",
        enemyStrong: "Strong enemy (100 HP)",
        enemyBoss: "Boss (200 HP)",
        turnsLabel: "turns",
        levelExplanation: "Based on DPR and attack bonus",
        levelRange: "Level",

        // Power Level
        powerLevelTitle: "⚡ Character Power Level",
        powerLevelLabel: "Power Level",
        howCalculated: "📊 How it's calculated:",
        whyTheseFactors: "Why these factors?",
        dprTotalExplain: "Includes advantage, crits, and multiple attacks",
        hitChanceExplain: "Penalizes unreliable builds",
        scaleExplain: "Scale for comparable numbers",

        // Profiles
        profilesTitle: "📁 Saved Profiles",
        profileNamePlaceholder: "Profile name...",
        saveProfileBtn: "💾 Save Profile",
        loadProfileTooltip: "Load this profile",
        deleteProfileTooltip: "Delete this profile",
        noProfiles: "No saved profiles",
        confirmDeleteProfile: "Delete profile '{{name}}'?",
        profileSaved: "Profile '{{name}}' saved",
        profileLoaded: "Profile '{{name}}' loaded",
        profileDeleted: "Profile deleted",
        profileNameRequired: "Enter a profile name",
        profileWithAdvantage: "Advantage",
        profileWithDisadvantage: "Disadvantage",
        profileAttacks: "{{n}} attacks",

        // Profile Comparison
        compareTitle: "⚔️ Compare Profiles",
        compareSelectProfiles: "Select profiles to compare:",
        compareTargetAC: "AC to compare",
        compareButton: "📊 Compare",
        compareMinSelect: "Select at least 2 profiles to compare",
        compareNoProfiles: "Save profiles first to compare them",
        compareResultsTitle: "📊 Profile Comparison",
        compareVsAC: "vs AC",
        comparePowerLevel: "Power Level",
        compareHitChance: "Hit Prob.",
        compareCritChance: "Crit Prob.",
        compareRollNeeded: "Min Roll",
        compareNormalDmg: "Normal Dmg",
        compareCritDmg: "Crit Dmg",
        compareDPR: "Total DPR",
        compareAttacks: "Attacks",
        compareBest: "BEST",
        compareAutoHit: "Auto",
        compareCritOnly: "Crit Only",
        compareAdvantage: "Adv.",
        compareDisadvantage: "Dis.",
        compareDice: "Dice",
        compareAttackBonus: "Attack Bonus",

        // Profile Editing
        editProfile: "Edit",
        editingProfile: "Editing:",
        updateProfile: "Update Profile",
        cancelEdit: "Cancel",

        // Attack Dice Bonus
        attackDiceBonus: "Attack Bonus Die",
        attackDiceBonusTooltip: "Extra die for attack rolls (e.g., Bless, Bardic Inspiration)",
        attackDiceBonusNone: "None",
        attackDiceBonusBless: "+1d4 (Bless)",
        attackDiceBonusBardic6: "+1d6 (Bardic)",
        attackDiceBonusBardic8: "+1d8 (Bardic)",
        attackDiceBonusBardic10: "+1d10 (Bardic)",
        attackDiceBonusBardic12: "+1d12 (Bardic)",
        profileWithAttackDice: "+1d{{sides}}",
        compareAttackDice: "Bonus Die"
    },

    pt: {
        // Header
        title: "⚔️ Calculadora de Probabilidade de Ataque D&D",
        subtitle: "Calcule suas probabilidades de acerto e dano esperado",

        // Config panel
        configTitle: "⚙️ Configuração de Ataque",
        attackBonus: "Bônus de Ataque",
        attackBonusTooltip: "Seu modificador total de ataque (ex: +5)",
        damageBonus: "Bônus de Dano",
        damageBonusTooltip: "Modificador somado ao dano (ex: +3)",
        damageDice: "Dados de Dano",
        addDice: "+ Adicionar Dado",
        critRange: "Alcance Crítico",
        critRange20: "Apenas 20 (5%)",
        critRange19: "19-20 (10%)",
        critRange18: "18-20 (15%)",
        advantageLabel: "Vantagem / Desvantagem",
        disadvantage: "Desvantagem",
        normal: "Normal",
        advantage: "Vantagem",
        numberOfAttacks: "Número de Ataques",
        targetAC: "CA Alvo (Opcional)",
        targetACTooltip: "Classe de Armadura do inimigo específico para destacar",
        targetACPlaceholder: "Ex: 15",
        calculateButton: "🎲 Calcular Probabilidades",

        // Results panel
        resultsTitle: "📊 Tabela de Probabilidades",
        tableHeaderAC: "CA",
        tableHeaderACTooltip: "Classe de Armadura do inimigo",
        tableHeaderMiss: "Erro",
        tableHeaderMissTooltip: "Probabilidade de errar (mesmo com 1 natural)",
        tableHeaderHit: "Acerto",
        tableHeaderHitTooltip: "Probabilidade de acerto normal (sem crítico)",
        tableHeaderCrit: "Crítico",
        tableHeaderCritTooltip: "Probabilidade de crítico (duplica dados de dano)",
        tableHeaderNormalDmg: "Dano Normal",
        tableHeaderNormalDmgTooltip: "Alcance de dano em acerto não-crítico",
        tableHeaderCritDmg: "Dano Crítico",
        tableHeaderCritDmgTooltip: "Alcance de dano em acerto crítico",
        tableHeaderDPR: "DPR",
        tableHeaderDPRTooltip: "Dano Por Rodada: dano médio esperado por turno considerando todas as probabilidades",
        tableHeaderViz: "Visualização",
        noData: "Clique em \"Calcular Probabilidades\" para ver os resultados",

        // Roll requirement messages
        rollReqAuto: "<strong>CA {{ac}}:</strong> Acerto automático (exceto em 1 natural)",
        rollReqCritOnly: "<strong>CA {{ac}}:</strong> Só pode acertar com crítico natural",
        rollReqNormal: "<strong>CA {{ac}}:</strong> Você precisa rolar <strong>{{roll}}</strong> ou mais no d20",
        rollReqAdvice: "<strong>Dica:</strong> Especifique uma CA alvo para ver os requisitos de rolagem",
        damageNormal: "<br><strong>Dano normal:</strong> {{min}}-{{max}} (média {{avg}})",
        damageCrit: "<br><strong>Dano crítico:</strong> {{min}}-{{max}} (média {{avg}})",

        // Multi-attack panel
        multiAttackTitle: "🎯 Distribuição de Múltiplos Ataques",
        multiAttackWith: "Contra CA {{ac}} com {{n}} ataques",
        multiAttackAdvantage: " <strong style=\"color: var(--color-hit);\">(COM VANTAGEM)</strong>",
        multiAttackDisadvantage: " <strong style=\"color: var(--color-miss);\">(COM DESVANTAGEM)</strong>",
        multiAttackHitProb: "Probabilidade de acerto por ataque: {{prob}}%",
        multiAttackCritProb: "Probabilidade de crítico por ataque: {{prob}}%",
        multiAttackSummary: "<strong style=\"color: var(--color-crit);\">📊 Resumo de dano total:</strong>",
        multiAttackAllNormal: "• Se todos acertarem (sem críticos): <strong style=\"color: var(--color-hit);\">{{min}}-{{max}} dano</strong>",
        multiAttackAllCrit: "• Se todos acertarem criticamente: <strong style=\"color: var(--color-crit);\">{{min}}-{{max}} dano</strong>",
        multiAttackRange: "• Alcance total possível: <strong style=\"color: var(--text-primary);\">0-{{max}} dano</strong>",
        multiAttackHint: "<em style=\"color: var(--text-muted); font-size: 0.9em;\">Clique em cada grupo para ver o detalhamento de críticos</em>",

        // Distribution labels
        hits_singular: "acerto",
        hits_plural: "acertos",
        normal_singular: "normal",
        normal_plural: "normais",
        crit_singular: "crítico",
        crit_plural: "críticos",
        noHits: "Sem acertos",
        damage: "dano",
        damageAvg: "(média: {{avg}})",

        // Legend
        legendMiss: "Erro",
        legendHit: "Acerto Normal",
        legendCrit: "Crítico",
        legendDPR: "DPR = Dano Por Rodada (dano médio esperado)",

        // Footer
        footerText: "Calculadora baseada nas regras de D&D 5e",

        // Alerts
        alertMinDice: "Você deve ter pelo menos um dado de dano",

        // Combat Statistics
        combatStatsTitle: "📊 Estatísticas de Combate",
        vsAC: "contra CA",
        statDPRTotal: "DPR Total",
        statHitProb: "Prob. Acerto",
        statDamagePerHit: "Dano/Acerto",
        statCritsPerRound: "Críticos/Turno",
        damagePerRound: "dano/rodada",
        average: "média",
        defeatTimesTitle: "⏱️ Turnos para Derrotar",
        enemyWeak: "Inimigo fraco (20 HP)",
        enemyNormal: "Inimigo normal (50 HP)",
        enemyStrong: "Inimigo forte (100 HP)",
        enemyBoss: "Chefe (200 HP)",
        turnsLabel: "turnos",
        levelExplanation: "Baseado em DPR e bônus de ataque",
        levelRange: "Nível",

        // Power Level
        powerLevelTitle: "⚡ Nível de Poder do Personagem",
        powerLevelLabel: "Power Level",
        howCalculated: "📊 Como é calculado:",
        whyTheseFactors: "Por que esses fatores?",
        dprTotalExplain: "Inclui vantagem, críticos e múltiplos ataques",
        hitChanceExplain: "Penaliza builds pouco confiáveis",
        scaleExplain: "Escala para números comparáveis",

        // Profiles
        profilesTitle: "📁 Perfis Salvos",
        profileNamePlaceholder: "Nome do perfil...",
        saveProfileBtn: "💾 Salvar Perfil",
        loadProfileTooltip: "Carregar este perfil",
        deleteProfileTooltip: "Excluir este perfil",
        noProfiles: "Nenhum perfil salvo",
        confirmDeleteProfile: "Excluir o perfil '{{name}}'?",
        profileSaved: "Perfil '{{name}}' salvo",
        profileLoaded: "Perfil '{{name}}' carregado",
        profileDeleted: "Perfil excluído",
        profileNameRequired: "Digite um nome para o perfil",
        profileWithAdvantage: "Vantagem",
        profileWithDisadvantage: "Desvantagem",
        profileAttacks: "{{n}} ataques",

        // Profile Comparison
        compareTitle: "⚔️ Comparar Perfis",
        compareSelectProfiles: "Selecione perfis para comparar:",
        compareTargetAC: "CA para comparar",
        compareButton: "📊 Comparar",
        compareMinSelect: "Selecione pelo menos 2 perfis para comparar",
        compareNoProfiles: "Salve perfis primeiro para compará-los",
        compareResultsTitle: "📊 Comparação de Perfis",
        compareVsAC: "contra CA",
        comparePowerLevel: "Power Level",
        compareHitChance: "Prob. Acerto",
        compareCritChance: "Prob. Crítico",
        compareRollNeeded: "Roll Mínimo",
        compareNormalDmg: "Dano Normal",
        compareCritDmg: "Dano Crítico",
        compareDPR: "DPR Total",
        compareAttacks: "Ataques",
        compareBest: "MELHOR",
        compareAutoHit: "Auto",
        compareCritOnly: "Só Crit",
        compareAdvantage: "Vant.",
        compareDisadvantage: "Desv.",
        compareDice: "Dados",
        compareAttackBonus: "Bônus Ataque",

        // Profile Editing
        editProfile: "Editar",
        editingProfile: "Editando:",
        updateProfile: "Atualizar Perfil",
        cancelEdit: "Cancelar",

        // Attack Dice Bonus
        attackDiceBonus: "Dado Bônus de Ataque",
        attackDiceBonusTooltip: "Dado extra para rolagens de ataque (ex: Bênção, Inspiração Bárdica)",
        attackDiceBonusNone: "Nenhum",
        attackDiceBonusBless: "+1d4 (Bênção)",
        attackDiceBonusBardic6: "+1d6 (Inspiração)",
        attackDiceBonusBardic8: "+1d8 (Inspiração)",
        attackDiceBonusBardic10: "+1d10 (Inspiração)",
        attackDiceBonusBardic12: "+1d12 (Inspiração)",
        profileWithAttackDice: "+1d{{sides}}",
        compareAttackDice: "Dado Bônus"
    },

    de: {
        // Header
        title: "⚔️ D&D Angriffwahrscheinlichkeits-Rechner",
        subtitle: "Berechne deine Trefferwahrscheinlichkeiten und erwarteten Schaden",

        // Config panel
        configTitle: "⚙️ Angriffskonfiguration",
        attackBonus: "Angriffsbonus",
        attackBonusTooltip: "Dein gesamter Angriffsmodifikator (z.B. +5)",
        damageBonus: "Schadensbonus",
        damageBonusTooltip: "Modifikator zum Schaden hinzugefügt (z.B. +3)",
        damageDice: "Schadenswürfel",
        addDice: "+ Würfel hinzufügen",
        critRange: "Kritischer Bereich",
        critRange20: "Nur 20 (5%)",
        critRange19: "19-20 (10%)",
        critRange18: "18-20 (15%)",
        advantageLabel: "Vorteil / Nachteil",
        disadvantage: "Nachteil",
        normal: "Normal",
        advantage: "Vorteil",
        numberOfAttacks: "Anzahl der Angriffe",
        targetAC: "Ziel-RK (Optional)",
        targetACTooltip: "Rüstungsklasse des spezifischen Feindes zum Hervorheben",
        targetACPlaceholder: "z.B. 15",
        calculateButton: "🎲 Wahrscheinlichkeiten berechnen",

        // Results panel
        resultsTitle: "📊 Wahrscheinlichkeitstabelle",
        tableHeaderAC: "RK",
        tableHeaderACTooltip: "Rüstungsklasse des Feindes",
        tableHeaderMiss: "Fehlschlag",
        tableHeaderMissTooltip: "Wahrscheinlichkeit zu verfehlen (auch bei natürlicher 1)",
        tableHeaderHit: "Treffer",
        tableHeaderHitTooltip: "Wahrscheinlichkeit eines normalen Treffers (kein kritischer)",
        tableHeaderCrit: "Kritisch",
        tableHeaderCritTooltip: "Wahrscheinlichkeit eines kritischen Treffers (verdoppelt Schadenswürfel)",
        tableHeaderNormalDmg: "Normaler Schaden",
        tableHeaderNormalDmgTooltip: "Schadensbereich bei nicht-kritischem Treffer",
        tableHeaderCritDmg: "Kritischer Schaden",
        tableHeaderCritDmgTooltip: "Schadensbereich bei kritischem Treffer",
        tableHeaderDPR: "SPR",
        tableHeaderDPRTooltip: "Schaden Pro Runde: erwarteter Durchschnittsschaden pro Runde unter Berücksichtigung aller Wahrscheinlichkeiten",
        tableHeaderViz: "Visualisierung",
        noData: "Klicke auf \"Wahrscheinlichkeiten berechnen\", um Ergebnisse zu sehen",

        // Roll requirement messages
        rollReqAuto: "<strong>RK {{ac}}:</strong> Automatischer Treffer (außer bei natürlicher 1)",
        rollReqCritOnly: "<strong>RK {{ac}}:</strong> Kann nur mit natürlichem Kritischen treffen",
        rollReqNormal: "<strong>RK {{ac}}:</strong> Du musst <strong>{{roll}}</strong> oder höher auf dem W20 würfeln",
        rollReqAdvice: "<strong>Tipp:</strong> Gib eine Ziel-RK an, um Wurf-Anforderungen zu sehen",
        damageNormal: "<br><strong>Normaler Schaden:</strong> {{min}}-{{max}} (Durchschnitt {{avg}})",
        damageCrit: "<br><strong>Kritischer Schaden:</strong> {{min}}-{{max}} (Durchschnitt {{avg}})",

        // Multi-attack panel
        multiAttackTitle: "🎯 Verteilung mehrerer Angriffe",
        multiAttackWith: "Gegen RK {{ac}} mit {{n}} Angriffen",
        multiAttackAdvantage: " <strong style=\"color: var(--color-hit);\">(MIT VORTEIL)</strong>",
        multiAttackDisadvantage: " <strong style=\"color: var(--color-miss);\">(MIT NACHTEIL)</strong>",
        multiAttackHitProb: "Trefferwahrscheinlichkeit pro Angriff: {{prob}}%",
        multiAttackCritProb: "Kritische Wahrscheinlichkeit pro Angriff: {{prob}}%",
        multiAttackSummary: "<strong style=\"color: var(--color-crit);\">📊 Gesamtschadenszusammenfassung:</strong>",
        multiAttackAllNormal: "• Wenn alle treffen (keine Kritischen): <strong style=\"color: var(--color-hit);\">{{min}}-{{max}} Schaden</strong>",
        multiAttackAllCrit: "• Wenn alle kritisch treffen: <strong style=\"color: var(--color-crit);\">{{min}}-{{max}} Schaden</strong>",
        multiAttackRange: "• Gesamtmöglicher Bereich: <strong style=\"color: var(--text-primary);\">0-{{max}} Schaden</strong>",
        multiAttackHint: "<em style=\"color: var(--text-muted); font-size: 0.9em;\">Klicke auf jede Gruppe, um detaillierte Kritische-Aufschlüsselung zu sehen</em>",

        // Distribution labels
        hits_singular: "Treffer",
        hits_plural: "Treffer",
        normal_singular: "normal",
        normal_plural: "normale",
        crit_singular: "kritisch",
        crit_plural: "kritische",
        noHits: "Keine Treffer",
        damage: "Schaden",
        damageAvg: "(Durchschnitt: {{avg}})",

        // Legend
        legendMiss: "Fehlschlag",
        legendHit: "Normaler Treffer",
        legendCrit: "Kritisch",
        legendDPR: "SPR = Schaden Pro Runde (erwarteter Durchschnittsschaden)",

        // Footer
        footerText: "Rechner basierend auf D&D 5e Regeln",

        // Alerts
        alertMinDice: "Du musst mindestens einen Schadenswürfel haben",

        // Combat Statistics
        combatStatsTitle: "📊 Kampfstatistiken",
        vsAC: "gegen RK",
        statDPRTotal: "Gesamt-SPR",
        statHitProb: "Trefferwahrsch.",
        statDamagePerHit: "Schaden/Treffer",
        statCritsPerRound: "Kritische/Runde",
        damagePerRound: "schaden/runde",
        average: "durchschnitt",
        defeatTimesTitle: "⏱️ Runden zum Besiegen",
        enemyWeak: "Schwacher Gegner (20 TP)",
        enemyNormal: "Normaler Gegner (50 TP)",
        enemyStrong: "Starker Gegner (100 TP)",
        enemyBoss: "Boss (200 TP)",
        turnsLabel: "runden",
        levelExplanation: "Basierend auf SPR und Angriffsbonus",
        levelRange: "Stufe",

        // Power Level
        powerLevelTitle: "⚡ Charakter-Machtstufe",
        powerLevelLabel: "Power Level",
        howCalculated: "📊 Wie wird es berechnet:",
        whyTheseFactors: "Warum diese Faktoren?",
        dprTotalExplain: "Beinhaltet Vorteil, Kritische und mehrere Angriffe",
        hitChanceExplain: "Bestraft unzuverlässige Builds",
        scaleExplain: "Skala für vergleichbare Zahlen",

        // Profiles
        profilesTitle: "📁 Gespeicherte Profile",
        profileNamePlaceholder: "Profilname...",
        saveProfileBtn: "💾 Profil Speichern",
        loadProfileTooltip: "Dieses Profil laden",
        deleteProfileTooltip: "Dieses Profil löschen",
        noProfiles: "Keine gespeicherten Profile",
        confirmDeleteProfile: "Profil '{{name}}' löschen?",
        profileSaved: "Profil '{{name}}' gespeichert",
        profileLoaded: "Profil '{{name}}' geladen",
        profileDeleted: "Profil gelöscht",
        profileNameRequired: "Gib einen Profilnamen ein",
        profileWithAdvantage: "Vorteil",
        profileWithDisadvantage: "Nachteil",
        profileAttacks: "{{n}} Angriffe",

        // Profile Comparison
        compareTitle: "⚔️ Profile Vergleichen",
        compareSelectProfiles: "Profile zum Vergleichen auswählen:",
        compareTargetAC: "RK zum Vergleichen",
        compareButton: "📊 Vergleichen",
        compareMinSelect: "Wähle mindestens 2 Profile zum Vergleichen",
        compareNoProfiles: "Speichere zuerst Profile zum Vergleichen",
        compareResultsTitle: "📊 Profil-Vergleich",
        compareVsAC: "gegen RK",
        comparePowerLevel: "Power Level",
        compareHitChance: "Trefferwahrsch.",
        compareCritChance: "Krit. Wahrsch.",
        compareRollNeeded: "Min. Wurf",
        compareNormalDmg: "Normaler Schaden",
        compareCritDmg: "Krit. Schaden",
        compareDPR: "Gesamt-SPR",
        compareAttacks: "Angriffe",
        compareBest: "BESTE",
        compareAutoHit: "Auto",
        compareCritOnly: "Nur Krit",
        compareAdvantage: "Vort.",
        compareDisadvantage: "Nacht.",
        compareDice: "Würfel",
        compareAttackBonus: "Angriffsbonus",

        // Profile Editing
        editProfile: "Bearbeiten",
        editingProfile: "Bearbeiten:",
        updateProfile: "Profil Aktualisieren",
        cancelEdit: "Abbrechen",

        // Attack Dice Bonus
        attackDiceBonus: "Angriffswürfel-Bonus",
        attackDiceBonusTooltip: "Zusätzlicher Würfel für Angriffswürfe (z.B. Segnen, Bardische Inspiration)",
        attackDiceBonusNone: "Keiner",
        attackDiceBonusBless: "+1d4 (Segnen)",
        attackDiceBonusBardic6: "+1d6 (Bardisch)",
        attackDiceBonusBardic8: "+1d8 (Bardisch)",
        attackDiceBonusBardic10: "+1d10 (Bardisch)",
        attackDiceBonusBardic12: "+1d12 (Bardisch)",
        profileWithAttackDice: "+1d{{sides}}",
        compareAttackDice: "Bonuswürfel"
    }
};

// Helper function to get translated text with placeholder replacement
function t(key, params = {}) {
    let text = translations[currentLanguage][key];
    if (!text) {
        console.warn(`Missing translation: ${currentLanguage}.${key}`);
        return key;
    }

    // Replace {{var}} with params.var
    return text.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
    });
}

// Function to set language and update all UI elements
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language ${lang} not supported, falling back to Spanish`);
        lang = 'es';
    }

    currentLanguage = lang;

    // Save to localStorage
    try {
        localStorage.setItem('language', lang);
    } catch (e) {
        console.warn('localStorage not available');
    }

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            if (el.tagName === 'INPUT' && el.type === 'button') {
                el.value = translations[currentLanguage][key];
            } else if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = translations[currentLanguage][key];
            } else {
                el.textContent = translations[currentLanguage][key];
            }
        }
    });

    // Update tooltips
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
        const key = el.getAttribute('data-i18n-tooltip');
        if (translations[currentLanguage][key]) {
            el.setAttribute('data-tooltip', translations[currentLanguage][key]);
        }
    });

    // Update the tooltip-text spans
    document.querySelectorAll('.tooltip-text[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            el.textContent = translations[currentLanguage][key];
        }
    });

    // Re-calculate to update dynamic texts
    if (typeof calculator !== 'undefined' && calculator) {
        calculator.calculate();
    }
}

// Initialize language on page load
function initializeLanguage() {
    // Try to get from localStorage
    let savedLang = null;
    try {
        savedLang = localStorage.getItem('language');
    } catch (e) {
        console.warn('localStorage not available');
    }

    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else {
        // Auto-detect from browser
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const langPrefix = browserLang.toLowerCase().split('-')[0];
            if (translations[langPrefix]) {
                currentLanguage = langPrefix;
            }
        }
    }

    // Set the initial language in custom selector
    const selector = document.getElementById('languageSelect');
    if (selector) {
        const selected = selector.querySelector('.select-selected');
        const items = selector.querySelectorAll('.select-items div');

        items.forEach(item => {
            if (item.getAttribute('data-value') === currentLanguage) {
                selected.innerHTML = item.innerHTML;
            }
        });
    }

    // Apply language
    setLanguage(currentLanguage);
}

// ========== SISTEMA DE ESTADÍSTICAS DE COMBATE ==========

function estimateCharacterLevel(attackBonus, dpr) {
    // Benchmarks basados en DMG y análisis de optimización típica de D&D 5e
    const benchmarks = [
        {minLevel: 1, maxLevel: 4, minDPR: 5, maxDPR: 15, minAB: 2, maxAB: 5},
        {minLevel: 3, maxLevel: 7, minDPR: 12, maxDPR: 25, minAB: 4, maxAB: 7},
        {minLevel: 5, maxLevel: 11, minDPR: 20, maxDPR: 40, minAB: 6, maxAB: 10},
        {minLevel: 9, maxLevel: 16, minDPR: 35, maxDPR: 60, minAB: 9, maxAB: 13},
        {minLevel: 15, maxLevel: 20, minDPR: 55, maxDPR: 100, minAB: 12, maxAB: 17}
    ];

    for (const bench of benchmarks) {
        const dprMatch = dpr >= bench.minDPR && dpr <= bench.maxDPR;
        const abMatch = attackBonus >= bench.minAB && attackBonus <= bench.maxAB;

        if (dprMatch || abMatch) {
            // Ajustar rango si solo uno coincide
            if (dprMatch && !abMatch) {
                if (attackBonus > bench.maxAB) {
                    return {min: bench.minLevel + 2, max: Math.min(20, bench.maxLevel + 2)};
                } else {
                    return {min: Math.max(1, bench.minLevel - 2), max: bench.maxLevel};
                }
            }
            return {min: bench.minLevel, max: bench.maxLevel};
        }
    }

    // Extremadamente poderoso
    return {min: 17, max: 20};
}

// ========== SISTEMA DE PERFILES ==========

class ProfileManager {
    constructor(calculator) {
        this.calculator = calculator;
        this.storageKey = 'dnd_calc_profiles';
        this.profiles = this.loadFromStorage();
        this.editingProfileId = null; // Track which profile is being edited
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('Error loading profiles:', e);
            return [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.profiles));
        } catch (e) {
            console.warn('Error saving profiles:', e);
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Start editing a profile
    startEditing(id) {
        const profile = this.profiles.find(p => p.id === id);
        if (!profile) return;

        this.editingProfileId = id;
        this.loadProfile(id); // Load config into form
        this.renderProfiles(); // Re-render to show editing state
        this.showEditingIndicator(profile.name);
    }

    // Cancel editing mode
    cancelEditing() {
        this.editingProfileId = null;
        this.hideEditingIndicator();
        this.renderProfiles();
    }

    // Show editing indicator UI
    showEditingIndicator(profileName) {
        const indicator = document.getElementById('editingIndicator');
        const textEl = document.getElementById('editingText');
        if (indicator && textEl) {
            textEl.textContent = `${t('editingProfile')} ${profileName}`;
            indicator.style.display = 'flex';
        }
    }

    // Hide editing indicator UI
    hideEditingIndicator() {
        const indicator = document.getElementById('editingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // Check if currently editing
    isEditing() {
        return this.editingProfileId !== null;
    }

    // Get the profile being edited
    getEditingProfile() {
        if (!this.editingProfileId) return null;
        return this.profiles.find(p => p.id === this.editingProfileId);
    }

    saveProfile(name) {
        if (!name || !name.trim()) {
            return { success: false, messageKey: 'profileNameRequired' };
        }

        // If editing, update the existing profile
        if (this.editingProfileId) {
            const index = this.profiles.findIndex(p => p.id === this.editingProfileId);
            if (index !== -1) {
                this.profiles[index] = {
                    ...this.profiles[index],
                    name: name.trim(),
                    updatedAt: Date.now(),
                    config: {
                        attackBonus: this.calculator.config.attackBonus,
                        damageBonus: this.calculator.config.damageBonus,
                        damageDice: this.calculator.config.damageDice.map(d => ({ ...d })),
                        attackDiceBonus: this.calculator.config.attackDiceBonus,
                        advantage: this.calculator.config.advantage,
                        critRange: this.calculator.config.critRange,
                        numberOfAttacks: this.calculator.config.numberOfAttacks,
                        targetAC: this.calculator.config.targetAC
                    }
                };
                const updatedProfile = this.profiles[index];
                this.editingProfileId = null;
                this.hideEditingIndicator();
                this.saveToStorage();
                this.renderProfiles();
                return { success: true, profile: updatedProfile, updated: true };
            }
        }

        // Create new profile
        const profile = {
            id: this.generateId(),
            name: name.trim(),
            createdAt: Date.now(),
            config: {
                attackBonus: this.calculator.config.attackBonus,
                damageBonus: this.calculator.config.damageBonus,
                damageDice: this.calculator.config.damageDice.map(d => ({ ...d })),
                attackDiceBonus: this.calculator.config.attackDiceBonus,
                advantage: this.calculator.config.advantage,
                critRange: this.calculator.config.critRange,
                numberOfAttacks: this.calculator.config.numberOfAttacks,
                targetAC: this.calculator.config.targetAC
            }
        };

        this.profiles.unshift(profile); // Más reciente primero
        this.saveToStorage();
        this.renderProfiles();
        return { success: true, profile };
    }

    loadProfile(id) {
        const profile = this.profiles.find(p => p.id === id);
        if (!profile) return { success: false };

        // Restaurar configuración en calculator
        const cfg = profile.config;
        this.calculator.config.attackBonus = cfg.attackBonus;
        this.calculator.config.damageBonus = cfg.damageBonus;
        this.calculator.config.damageDice = cfg.damageDice.map(d => ({ ...d }));
        this.calculator.config.advantage = cfg.advantage;
        this.calculator.config.critRange = cfg.critRange;
        this.calculator.config.numberOfAttacks = cfg.numberOfAttacks;
        this.calculator.config.targetAC = cfg.targetAC;
        this.calculator.config.attackDiceBonus = cfg.attackDiceBonus || 0;

        // Actualizar UI inputs
        this.updateUIFromConfig();

        // Recalcular
        this.calculator.calculate();

        return { success: true, profile };
    }

    deleteProfile(id) {
        const profile = this.profiles.find(p => p.id === id);
        if (profile && confirm(t('confirmDeleteProfile', { name: profile.name }))) {
            this.profiles = this.profiles.filter(p => p.id !== id);
            this.saveToStorage();
            this.renderProfiles();
            return true;
        }
        return false;
    }

    updateUIFromConfig() {
        const cfg = this.calculator.config;

        // Actualizar inputs numéricos
        document.getElementById('attackBonus').value = cfg.attackBonus;
        document.getElementById('damageBonus').value = cfg.damageBonus;
        document.getElementById('critRange').value = cfg.critRange;
        document.getElementById('numberOfAttacks').value = cfg.numberOfAttacks;
        document.getElementById('attacksValue').textContent = cfg.numberOfAttacks;

        if (cfg.targetAC) {
            document.getElementById('targetAC').value = cfg.targetAC;
        } else {
            document.getElementById('targetAC').value = '';
        }

        // Actualizar radio buttons de ventaja
        document.querySelectorAll('input[name="advantage"]').forEach(radio => {
            radio.checked = radio.value === cfg.advantage;
        });

        // Actualizar select de dado extra al ataque
        const attackDiceBonusSelect = document.getElementById('attackDiceBonus');
        if (attackDiceBonusSelect) {
            attackDiceBonusSelect.value = cfg.attackDiceBonus || 0;
        }

        // Reconstruir dados de daño
        const diceList = document.getElementById('diceList');
        diceList.innerHTML = '';

        cfg.damageDice.forEach((die, index) => {
            const diceItem = document.createElement('div');
            diceItem.className = 'dice-item';
            diceItem.innerHTML = `
                <input type="number" class="dice-count" value="${die.count}" min="1" max="10">
                <span>d</span>
                <select class="dice-sides">
                    <option value="4"${die.sides === 4 ? ' selected' : ''}>4</option>
                    <option value="6"${die.sides === 6 ? ' selected' : ''}>6</option>
                    <option value="8"${die.sides === 8 ? ' selected' : ''}>8</option>
                    <option value="10"${die.sides === 10 ? ' selected' : ''}>10</option>
                    <option value="12"${die.sides === 12 ? ' selected' : ''}>12</option>
                    <option value="20"${die.sides === 20 ? ' selected' : ''}>20</option>
                    <option value="100"${die.sides === 100 ? ' selected' : ''}>100</option>
                </select>
                <button class="btn-remove" onclick="removeDice(this)">×</button>
            `;
            diceList.appendChild(diceItem);
        });

        // Actualizar notación de dados
        this.calculator.updateDiceNotation();
    }

    formatProfilePreview(config) {
        // Crear preview compacto: "+5 | 1d8+3 | Ventaja | 2 ataques"
        const diceStr = config.damageDice.map(d => `${d.count}d${d.sides}`).join('+');
        const dmgStr = config.damageBonus > 0 ? `${diceStr}+${config.damageBonus}` : diceStr;

        let parts = [`+${config.attackBonus}`, dmgStr];

        if (config.advantage === 'advantage') {
            parts.push(t('profileWithAdvantage'));
        } else if (config.advantage === 'disadvantage') {
            parts.push(t('profileWithDisadvantage'));
        }

        if (config.attackDiceBonus && config.attackDiceBonus > 0) {
            parts.push(t('profileWithAttackDice', { sides: config.attackDiceBonus }));
        }

        if (config.numberOfAttacks > 1) {
            parts.push(t('profileAttacks', { n: config.numberOfAttacks }));
        }

        if (config.targetAC) {
            parts.push(`CA: ${config.targetAC}`);
        }

        return parts.join(' | ');
    }

    renderProfiles() {
        const listEl = document.getElementById('profilesList');
        const noProfilesEl = document.getElementById('noProfiles');

        if (!listEl) return;

        if (this.profiles.length === 0) {
            listEl.innerHTML = '';
            if (noProfilesEl) noProfilesEl.style.display = 'block';
        } else {
            if (noProfilesEl) noProfilesEl.style.display = 'none';

            listEl.innerHTML = this.profiles.map(profile => {
                const isEditing = this.editingProfileId === profile.id;
                return `
                <div class="profile-card ${isEditing ? 'editing' : ''}" data-id="${profile.id}">
                    <div class="profile-info">
                        <span class="profile-name">${this.escapeHtml(profile.name)}</span>
                        <span class="profile-preview">${this.formatProfilePreview(profile.config)}</span>
                    </div>
                    <div class="profile-actions">
                        <button class="btn-edit" onclick="editProfile('${profile.id}')" title="${t('editProfile')}">✏️</button>
                        <button class="btn-load" onclick="loadProfile('${profile.id}')" title="${t('loadProfileTooltip')}">📥</button>
                        <button class="btn-delete" onclick="deleteProfile('${profile.id}')" title="${t('deleteProfileTooltip')}">🗑️</button>
                    </div>
                </div>
            `}).join('');
        }

        // También actualizar los checkboxes de comparación si existe el comparador
        if (typeof profileComparator !== 'undefined' && profileComparator) {
            profileComparator.renderCompareCheckboxes();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========== SISTEMA DE COMPARACIÓN DE PERFILES ==========

class ProfileComparator {
    constructor(profileManager) {
        this.profileManager = profileManager;
        this.selectedProfiles = new Set();
    }

    // Calcular estadísticas para una configuración de perfil
    calculateStatsForConfig(config, targetAC) {
        // Cálculos de probabilidad
        const targetRoll = targetAC - config.attackBonus;
        const critMin = config.critRange;
        const bonusDie = config.attackDiceBonus || 0;

        let hitChance, critChance;

        // If there's an attack dice bonus, use the special calculation
        if (bonusDie && bonusDie > 0) {
            const result = this.calculateProbabilityWithBonusDie(targetRoll, critMin, config.advantage, bonusDie);
            hitChance = result.hit;
            critChance = result.crit;
        } else if (config.advantage === 'normal') {
            const result = this.calculateNormalProbability(targetRoll, critMin);
            hitChance = result.hit;
            critChance = result.crit;
        } else if (config.advantage === 'advantage') {
            const result = this.calculateAdvantageProbability(targetRoll, critMin);
            hitChance = result.hit;
            critChance = result.crit;
        } else {
            const result = this.calculateDisadvantageProbability(targetRoll, critMin);
            hitChance = result.hit;
            critChance = result.crit;
        }

        // Calcular daño
        const normalDamage = this.calculateDamageRange(config.damageDice, config.damageBonus, false);
        const critDamage = this.calculateDamageRange(config.damageDice, config.damageBonus, true);

        // DPR
        const normalAvgDmg = this.calculateAverageDamage(config.damageDice, config.damageBonus, false);
        const critAvgDmg = this.calculateAverageDamage(config.damageDice, config.damageBonus, true);
        const pNormalHit = hitChance - critChance;
        const dprPerAttack = pNormalHit * normalAvgDmg + critChance * critAvgDmg;
        const totalDPR = dprPerAttack * config.numberOfAttacks;

        // Power Level
        const powerLevel = Math.round(totalDPR * hitChance * 10);

        // Roll mínimo necesario
        let rollNeeded;
        if (targetRoll <= 1) {
            rollNeeded = 'auto'; // Impacto automático
        } else if (targetRoll >= 21) {
            rollNeeded = 'crit'; // Solo crítico
        } else {
            rollNeeded = targetRoll;
        }

        return {
            hitChance,
            critChance,
            normalDamage,
            critDamage,
            normalAvgDmg,
            critAvgDmg,
            dprPerAttack,
            totalDPR,
            powerLevel,
            rollNeeded,
            numberOfAttacks: config.numberOfAttacks,
            advantage: config.advantage
        };
    }

    calculateNormalProbability(targetRoll, critMin) {
        if (targetRoll >= 21) {
            const critChance = (21 - critMin) / 20;
            return { hit: critChance, crit: critChance };
        }
        if (targetRoll <= 1) {
            const critChance = (21 - critMin) / 20;
            return { hit: 0.95, crit: critChance };
        }
        const hitRolls = 21 - targetRoll;
        const critRolls = 21 - critMin;
        return { hit: hitRolls / 20, crit: critRolls / 20 };
    }

    calculateAdvantageProbability(targetRoll, critMin) {
        let pHit, pCrit;
        if (targetRoll >= 21) {
            pCrit = 1 - ((critMin - 1) / 20) ** 2;
            pHit = pCrit;
        } else if (targetRoll <= 1) {
            pHit = 1 - (1 / 20) ** 2;
            pCrit = 1 - ((critMin - 1) / 20) ** 2;
        } else {
            pHit = 1 - ((targetRoll - 1) / 20) ** 2;
            pCrit = 1 - ((critMin - 1) / 20) ** 2;
        }
        return { hit: pHit, crit: pCrit };
    }

    calculateDisadvantageProbability(targetRoll, critMin) {
        let pHit, pCrit;
        if (targetRoll >= 21) {
            pCrit = ((21 - critMin) / 20) ** 2;
            pHit = pCrit;
        } else if (targetRoll <= 1) {
            pHit = 1 - (1 / 20) ** 2;
            pCrit = ((21 - critMin) / 20) ** 2;
        } else {
            pHit = ((21 - targetRoll) / 20) ** 2;
            pCrit = ((21 - critMin) / 20) ** 2;
        }
        return { hit: pHit, crit: pCrit };
    }

    calculateProbabilityWithBonusDie(targetRoll, critMin, advantage, bonusDieSides) {
        let hitCount = 0, critCount = 0, missCount = 0;
        let totalOutcomes;

        if (advantage === 'normal') {
            totalOutcomes = 20 * bonusDieSides;
            for (let d20 = 1; d20 <= 20; d20++) {
                for (let bonus = 1; bonus <= bonusDieSides; bonus++) {
                    if (d20 === 1) {
                        missCount++;
                    } else if (d20 >= critMin) {
                        critCount++;
                    } else if (d20 + bonus >= targetRoll) {
                        hitCount++;
                    } else {
                        missCount++;
                    }
                }
            }
        } else if (advantage === 'advantage') {
            totalOutcomes = 20 * 20 * bonusDieSides;
            for (let d1 = 1; d1 <= 20; d1++) {
                for (let d2 = 1; d2 <= 20; d2++) {
                    const d20 = Math.max(d1, d2);
                    for (let bonus = 1; bonus <= bonusDieSides; bonus++) {
                        if (d1 === 1 && d2 === 1) {
                            missCount++;
                        } else if (d20 >= critMin) {
                            critCount++;
                        } else if (d20 + bonus >= targetRoll) {
                            hitCount++;
                        } else {
                            missCount++;
                        }
                    }
                }
            }
        } else {
            // disadvantage
            totalOutcomes = 20 * 20 * bonusDieSides;
            for (let d1 = 1; d1 <= 20; d1++) {
                for (let d2 = 1; d2 <= 20; d2++) {
                    const d20 = Math.min(d1, d2);
                    for (let bonus = 1; bonus <= bonusDieSides; bonus++) {
                        if (d1 === 1 || d2 === 1) {
                            missCount++;
                        } else if (d20 >= critMin) {
                            critCount++;
                        } else if (d20 + bonus >= targetRoll) {
                            hitCount++;
                        } else {
                            missCount++;
                        }
                    }
                }
            }
        }

        return {
            hit: (hitCount + critCount) / totalOutcomes,
            crit: critCount / totalOutcomes,
            miss: missCount / totalOutcomes
        };
    }

    calculateDamageRange(damageDice, damageBonus, isCrit) {
        let min = 0, max = 0;
        damageDice.forEach(die => {
            const multiplier = isCrit ? die.count * 2 : die.count;
            min += multiplier * 1;
            max += multiplier * die.sides;
        });
        return {
            min: min + damageBonus,
            max: max + damageBonus,
            avg: (min + max) / 2 + damageBonus
        };
    }

    calculateAverageDamage(damageDice, damageBonus, isCrit) {
        let avgDice = 0;
        damageDice.forEach(die => {
            const avgPerDie = (1 + die.sides) / 2;
            const multiplier = isCrit ? die.count * 2 : die.count;
            avgDice += multiplier * avgPerDie;
        });
        return avgDice + damageBonus;
    }

    // Comparar perfiles seleccionados
    compareProfiles(profileIds, targetAC) {
        const results = [];

        profileIds.forEach(id => {
            const profile = this.profileManager.profiles.find(p => p.id === id);
            if (!profile) return;

            const stats = this.calculateStatsForConfig(profile.config, targetAC);
            results.push({
                id: profile.id,
                name: profile.name,
                config: profile.config,
                stats
            });
        });

        // Encontrar los mejores valores para cada métrica
        const bests = this.findBestValues(results);

        return { results, bests, targetAC };
    }

    findBestValues(results) {
        if (results.length === 0) return {};

        const bests = {
            powerLevel: { value: -Infinity, ids: [] },
            hitChance: { value: -Infinity, ids: [] },
            critChance: { value: -Infinity, ids: [] },
            totalDPR: { value: -Infinity, ids: [] },
            rollNeeded: { value: Infinity, ids: [] }, // Menor es mejor
            normalDamageMax: { value: -Infinity, ids: [] },
            critDamageMax: { value: -Infinity, ids: [] }
        };

        results.forEach(r => {
            const s = r.stats;

            // Power Level (mayor es mejor)
            if (s.powerLevel > bests.powerLevel.value) {
                bests.powerLevel = { value: s.powerLevel, ids: [r.id] };
            } else if (s.powerLevel === bests.powerLevel.value) {
                bests.powerLevel.ids.push(r.id);
            }

            // Hit Chance (mayor es mejor)
            if (s.hitChance > bests.hitChance.value) {
                bests.hitChance = { value: s.hitChance, ids: [r.id] };
            } else if (s.hitChance === bests.hitChance.value) {
                bests.hitChance.ids.push(r.id);
            }

            // Crit Chance (mayor es mejor)
            if (s.critChance > bests.critChance.value) {
                bests.critChance = { value: s.critChance, ids: [r.id] };
            } else if (s.critChance === bests.critChance.value) {
                bests.critChance.ids.push(r.id);
            }

            // Total DPR (mayor es mejor)
            if (s.totalDPR > bests.totalDPR.value) {
                bests.totalDPR = { value: s.totalDPR, ids: [r.id] };
            } else if (s.totalDPR === bests.totalDPR.value) {
                bests.totalDPR.ids.push(r.id);
            }

            // Roll Needed (menor es mejor) - solo para valores numéricos
            if (typeof s.rollNeeded === 'number') {
                if (s.rollNeeded < bests.rollNeeded.value) {
                    bests.rollNeeded = { value: s.rollNeeded, ids: [r.id] };
                } else if (s.rollNeeded === bests.rollNeeded.value) {
                    bests.rollNeeded.ids.push(r.id);
                }
            } else if (s.rollNeeded === 'auto') {
                // Auto-hit es el mejor
                if (bests.rollNeeded.value !== 0) {
                    bests.rollNeeded = { value: 0, ids: [r.id] };
                } else {
                    bests.rollNeeded.ids.push(r.id);
                }
            }

            // Max Normal Damage (mayor es mejor)
            if (s.normalDamage.max > bests.normalDamageMax.value) {
                bests.normalDamageMax = { value: s.normalDamage.max, ids: [r.id] };
            } else if (s.normalDamage.max === bests.normalDamageMax.value) {
                bests.normalDamageMax.ids.push(r.id);
            }

            // Max Crit Damage (mayor es mejor)
            if (s.critDamage.max > bests.critDamageMax.value) {
                bests.critDamageMax = { value: s.critDamage.max, ids: [r.id] };
            } else if (s.critDamage.max === bests.critDamageMax.value) {
                bests.critDamageMax.ids.push(r.id);
            }
        });

        return bests;
    }

    // Renderizar la tabla de comparación
    renderComparison(comparisonData) {
        const panel = document.getElementById('comparisonResultsPanel');
        const tableBody = document.getElementById('comparisonTableBody');
        const acLabel = document.getElementById('comparisonTargetAC');

        if (!panel || !tableBody) return;

        const { results, bests, targetAC } = comparisonData;

        // Mostrar panel y actualizar CA
        panel.style.display = 'block';
        if (acLabel) acLabel.textContent = targetAC;

        // Generar filas de la tabla
        tableBody.innerHTML = results.map(r => {
            const s = r.stats;
            const isBest = (metric) => bests[metric]?.ids.includes(r.id);

            // Formatear roll needed
            let rollDisplay;
            if (s.rollNeeded === 'auto') {
                rollDisplay = t('compareAutoHit');
            } else if (s.rollNeeded === 'crit') {
                rollDisplay = t('compareCritOnly');
            } else {
                rollDisplay = s.rollNeeded + '+';
            }

            // Formatear ventaja/desventaja
            let advDisplay = '';
            if (s.advantage === 'advantage') {
                advDisplay = `<span class="adv-badge advantage">${t('compareAdvantage')}</span>`;
            } else if (s.advantage === 'disadvantage') {
                advDisplay = `<span class="adv-badge disadvantage">${t('compareDisadvantage')}</span>`;
            }

            // Format dice with damage bonus
            const diceNotation = this.formatDiceNotation(r.config);
            const damageBonus = r.config.damageBonus;
            const diceDisplay = damageBonus > 0 ? `${diceNotation}+${damageBonus}` :
                               damageBonus < 0 ? `${diceNotation}${damageBonus}` : diceNotation;

            return `
                <tr>
                    <td class="profile-name-cell">
                        <strong>${this.escapeHtml(r.name)}</strong>
                        ${advDisplay}
                        ${s.numberOfAttacks > 1 ? `<span class="attacks-badge">${s.numberOfAttacks}×</span>` : ''}
                    </td>
                    <td class="dice-cell">
                        <span class="dice-notation">${diceDisplay}</span>
                    </td>
                    <td class="attack-bonus-cell">
                        <span class="attack-bonus">${this.formatAttackBonus(r.config.attackBonus)}</span>
                    </td>
                    <td class="attack-dice-cell">
                        <span class="attack-dice-bonus">${r.config.attackDiceBonus > 0 ? '+1d' + r.config.attackDiceBonus : '-'}</span>
                    </td>
                    <td class="${isBest('powerLevel') ? 'best-value' : ''}">
                        <span class="value-number">${s.powerLevel}</span>
                        ${isBest('powerLevel') ? '<span class="best-badge">🏆</span>' : ''}
                    </td>
                    <td class="${isBest('rollNeeded') ? 'best-value' : ''}">
                        <span class="value-number">${rollDisplay}</span>
                        ${isBest('rollNeeded') ? '<span class="best-badge">🏆</span>' : ''}
                    </td>
                    <td class="${isBest('hitChance') ? 'best-value' : ''}">
                        <span class="value-number">${(s.hitChance * 100).toFixed(1)}%</span>
                        ${isBest('hitChance') ? '<span class="best-badge">🏆</span>' : ''}
                    </td>
                    <td class="${isBest('critChance') ? 'best-value' : ''}">
                        <span class="value-number">${(s.critChance * 100).toFixed(1)}%</span>
                        ${isBest('critChance') ? '<span class="best-badge">🏆</span>' : ''}
                    </td>
                    <td class="${isBest('normalDamageMax') ? 'best-value' : ''}">
                        <span class="value-number">${s.normalDamage.min}-${s.normalDamage.max}</span>
                        ${isBest('normalDamageMax') ? '<span class="best-badge">🏆</span>' : ''}
                    </td>
                    <td class="${isBest('critDamageMax') ? 'best-value' : ''}">
                        <span class="value-number">${s.critDamage.min}-${s.critDamage.max}</span>
                        ${isBest('critDamageMax') ? '<span class="best-badge">🏆</span>' : ''}
                    </td>
                    <td class="${isBest('totalDPR') ? 'best-value' : ''}">
                        <span class="value-number">${s.totalDPR.toFixed(1)}</span>
                        ${isBest('totalDPR') ? '<span class="best-badge">🏆</span>' : ''}
                    </td>
                </tr>
            `;
        }).join('');

        // Scroll a los resultados
        panel.scrollIntoView({ behavior: 'smooth' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Format dice notation for display (e.g., "2d6+1d8")
    formatDiceNotation(config) {
        const mainDice = config.damageDice.map(d => `${d.count}d${d.sides}`).join('+');
        return mainDice;
    }

    // Format attack bonus for display (e.g., "+8" or "-2")
    formatAttackBonus(bonus) {
        return bonus >= 0 ? `+${bonus}` : `${bonus}`;
    }

    // Renderizar checkboxes de selección en la sección de comparación
    renderCompareCheckboxes() {
        const container = document.getElementById('compareProfilesList');
        const noProfilesMsg = document.getElementById('compareNoProfiles');

        if (!container) return;

        const profiles = this.profileManager.profiles;

        if (profiles.length === 0) {
            container.innerHTML = '';
            if (noProfilesMsg) noProfilesMsg.style.display = 'block';
            return;
        }

        if (noProfilesMsg) noProfilesMsg.style.display = 'none';

        container.innerHTML = profiles.map(profile => `
            <label class="compare-checkbox-item">
                <input type="checkbox"
                       class="compare-profile-checkbox"
                       value="${profile.id}"
                       ${this.selectedProfiles.has(profile.id) ? 'checked' : ''}>
                <span class="checkbox-custom"></span>
                <span class="compare-profile-name">${this.escapeHtml(profile.name)}</span>
                <span class="compare-profile-preview">${this.profileManager.formatProfilePreview(profile.config)}</span>
            </label>
        `).join('');

        // Event listeners para checkboxes
        container.querySelectorAll('.compare-profile-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedProfiles.add(e.target.value);
                } else {
                    this.selectedProfiles.delete(e.target.value);
                }
            });
        });
    }
}

// ========== CALCULADORA DE PROBABILIDADES D&D ==========

class DnDCalculator {
    constructor() {
        this.config = {
            attackBonus: 5,
            damageBonus: 3,
            damageDice: [{ count: 1, sides: 8 }],
            attackDiceBonus: 0, // 0 = none, 4 = d4, 6 = d6, 8 = d8, 10 = d10, 12 = d12
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

        // Attack Dice Bonus (Bless, Bardic Inspiration, etc.)
        const attackDiceBonusSelect = document.getElementById('attackDiceBonus');
        if (attackDiceBonusSelect) {
            attackDiceBonusSelect.addEventListener('change', (e) => {
                this.config.attackDiceBonus = parseInt(e.target.value) || 0;
            });
        }

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
        const bonusDie = this.config.attackDiceBonus;

        // If there's an attack dice bonus, use the special calculation
        if (bonusDie && bonusDie > 0) {
            return this.calculateProbabilityWithBonusDie(targetRoll, critMin, this.config.advantage, bonusDie);
        }

        // Standard calculation without bonus die
        if (this.config.advantage === 'normal') {
            return this.calculateNormalProbability(targetRoll, critMin);
        } else if (this.config.advantage === 'advantage') {
            return this.calculateAdvantageProbability(targetRoll, critMin);
        } else {
            return this.calculateDisadvantageProbability(targetRoll, critMin);
        }
    }

    // Calculate probability with attack bonus die (Bless, Bardic Inspiration, etc.)
    // This uses enumeration to get exact probabilities
    calculateProbabilityWithBonusDie(targetRoll, critMin, advantage, bonusDieSides) {
        let hitCount = 0, critCount = 0, missCount = 0;
        let totalOutcomes;

        if (advantage === 'normal') {
            // d20 + bonus die
            totalOutcomes = 20 * bonusDieSides;
            for (let d20 = 1; d20 <= 20; d20++) {
                for (let bonus = 1; bonus <= bonusDieSides; bonus++) {
                    if (d20 === 1) {
                        // Natural 1 always misses
                        missCount++;
                    } else if (d20 >= critMin) {
                        // Critical hit (based on d20 only)
                        critCount++;
                    } else if (d20 + bonus >= targetRoll) {
                        // Normal hit
                        hitCount++;
                    } else {
                        missCount++;
                    }
                }
            }
        } else if (advantage === 'advantage') {
            // max(d20_1, d20_2) + bonus die
            totalOutcomes = 20 * 20 * bonusDieSides;
            for (let d1 = 1; d1 <= 20; d1++) {
                for (let d2 = 1; d2 <= 20; d2++) {
                    const d20 = Math.max(d1, d2);
                    for (let bonus = 1; bonus <= bonusDieSides; bonus++) {
                        if (d1 === 1 && d2 === 1) {
                            // Both natural 1s = miss
                            missCount++;
                        } else if (d20 >= critMin) {
                            // Critical hit
                            critCount++;
                        } else if (d20 + bonus >= targetRoll) {
                            // Normal hit
                            hitCount++;
                        } else {
                            missCount++;
                        }
                    }
                }
            }
        } else {
            // min(d20_1, d20_2) + bonus die (disadvantage)
            totalOutcomes = 20 * 20 * bonusDieSides;
            for (let d1 = 1; d1 <= 20; d1++) {
                for (let d2 = 1; d2 <= 20; d2++) {
                    const d20 = Math.min(d1, d2);
                    for (let bonus = 1; bonus <= bonusDieSides; bonus++) {
                        if (d1 === 1 || d2 === 1) {
                            // At least one natural 1 with disadvantage = miss
                            // (we take the min, so if either is 1, result is 1)
                            if (d20 === 1) {
                                missCount++;
                            } else if (d20 >= critMin) {
                                critCount++;
                            } else if (d20 + bonus >= targetRoll) {
                                hitCount++;
                            } else {
                                missCount++;
                            }
                        } else if (d20 >= critMin) {
                            critCount++;
                        } else if (d20 + bonus >= targetRoll) {
                            hitCount++;
                        } else {
                            missCount++;
                        }
                    }
                }
            }
        }

        return {
            hit: (hitCount + critCount) / totalOutcomes,
            crit: critCount / totalOutcomes,
            miss: missCount / totalOutcomes
        };
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
                requirementText = t('rollReqAuto', { ac: this.config.targetAC });
            } else if (targetRoll >= 21) {
                requirementText = t('rollReqCritOnly', { ac: this.config.targetAC });
            } else {
                requirementText = t('rollReqNormal', { ac: this.config.targetAC, roll: targetRoll });
            }

            const normalDmg = this.calculateAverageDamage(false);
            const critDmg = this.calculateAverageDamage(true);
            const normalRange = this.calculateDamageRange(false);
            const critRange = this.calculateDamageRange(true);

            requirementText += t('damageNormal', {
                min: normalRange.min,
                max: normalRange.max,
                avg: normalDmg.toFixed(1)
            });
            requirementText += t('damageCrit', {
                min: critRange.min,
                max: critRange.max,
                avg: critDmg.toFixed(1)
            });

            rollRequirement.innerHTML = requirementText;
        } else {
            rollRequirement.innerHTML = t('rollReqAdvice');
        }

        // Combat Statistics - solo mostrar si hay CA objetivo
        const combatStatsPanel = document.getElementById('combatStatsPanel');
        if (this.config.targetAC && combatStatsPanel) {
            const targetAC = this.config.targetAC;
            const { hit: targetHit, crit: targetCrit } = this.calculateHitChance(targetAC);
            const targetDPR = this.calculateExpectedDPR(targetHit, targetCrit) * this.config.numberOfAttacks;
            this.renderCombatStats(targetAC, targetDPR, targetHit, targetCrit);
        } else if (combatStatsPanel) {
            combatStatsPanel.style.display = 'none';
        }

        // Múltiples ataques
        if (this.config.numberOfAttacks > 1) {
            multiAttackPanel.style.display = 'block';
            this.renderMultiAttackDistribution();
        } else {
            multiAttackPanel.style.display = 'none';
        }

        // Power Level - mostrar si hay CA objetivo
        if (this.config.targetAC) {
            const targetAC = this.config.targetAC;
            const { hit: targetHit } = this.calculateHitChance(targetAC);
            const targetDPR = this.calculateExpectedDPR(targetHit, this.calculateHitChance(targetAC).crit) * this.config.numberOfAttacks;
            this.renderPowerLevel(targetAC, targetDPR, targetHit);
        } else {
            const powerLevelSection = document.getElementById('powerLevelSection');
            if (powerLevelSection) {
                powerLevelSection.style.display = 'none';
            }
        }
    }

    renderMultiAttackDistribution() {
        const targetAC = this.config.targetAC || 15;
        const distribution = this.calculateMultiAttackDistribution(targetAC);
        const distributionDiv = document.getElementById('multiAttackDistribution');
        const infoDiv = document.getElementById('multiAttackInfo');

        // Texto de ventaja/desventaja
        const advantageText = this.config.advantage === 'advantage' ? t('multiAttackAdvantage') :
                              this.config.advantage === 'disadvantage' ? t('multiAttackDisadvantage') :
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
            ${t('multiAttackWith', { ac: targetAC, n: this.config.numberOfAttacks })}${advantageText}:<br>
            ${t('multiAttackHitProb', { prob: (pHit * 100).toFixed(1) })}<br>
            ${t('multiAttackCritProb', { prob: (pCrit * 100).toFixed(1) })}<br>
            <br>
            ${t('multiAttackSummary')}<br>
            <span style="color: var(--text-secondary);">
                ${t('multiAttackAllNormal', { min: allNormalsMin, max: allNormalsMax })}<br>
                ${t('multiAttackAllCrit', { min: allCritsMin, max: allCritsMax })}<br>
                ${t('multiAttackRange', { max: allCritsMax })}
            </span><br>
            <br>
            ${t('multiAttackHint')}
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
            const hitsLabel = totalHits === 1 ? t('hits_singular') : t('hits_plural');
            header.innerHTML = `
                <span class="dist-hits">${totalHits} ${hitsLabel}</span>
                <span class="dist-total-prob">${(totalProbability * 100).toFixed(1)}%</span>
                <button class="expand-btn">▼</button>
            `;

            // Detalles expandibles (combinaciones de críticos)
            const details = document.createElement('div');
            details.className = 'dist-details';

            combinations.forEach(({ normals, crits, probability, damage, damageMin, damageMax }) => {
                const combo = document.createElement('div');
                combo.className = 'dist-combo';

                let label;
                if (normals === 0 && crits === 0) {
                    label = t('noHits');
                } else {
                    const normalLabel = normals === 1 ? t('normal_singular') : t('normal_plural');
                    const critLabel = crits === 1 ? t('crit_singular') : t('crit_plural');
                    label = `${normals} ${normalLabel}, ${crits} ${critLabel}`;
                }

                // Formatear display de daño
                const damageDisplay = damageMin === damageMax
                    ? `${damageMin} ${t('damage')}`
                    : `${damageMin}-${damageMax} ${t('damage')} <span style="color: var(--text-muted); font-size: 0.85em;">${t('damageAvg', { avg: damage.toFixed(1) })}</span>`;

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

    renderCombatStats(ac, dpr, hitChance, critChance) {
        const panel = document.getElementById('combatStatsPanel');

        if (!panel) {
            console.warn('Combat stats panel element not found');
            return;
        }

        // Calcular métricas
        const normalDmg = this.calculateAverageDamage(false);
        const critDmg = this.calculateAverageDamage(true);
        const pNormalGivenHit = (hitChance - critChance) / hitChance;
        const pCritGivenHit = critChance / hitChance;
        const damagePerHit = (pNormalGivenHit * normalDmg) + (pCritGivenHit * critDmg);

        const numAttacks = this.config.numberOfAttacks;
        const critsPerRound = critChance * numAttacks;

        // Turnos para derrotar diferentes enemigos
        const enemies = [
            {key: 'enemyWeak', hp: 20},
            {key: 'enemyNormal', hp: 50},
            {key: 'enemyStrong', hp: 100},
            {key: 'enemyBoss', hp: 200}
        ];

        // Nivel estimado
        const level = estimateCharacterLevel(this.config.attackBonus, dpr);

        // Mostrar panel
        panel.style.display = 'block';

        // Actualizar AC objetivo
        const acLabel = document.getElementById('statsTargetAC');
        if (acLabel) acLabel.textContent = ac;

        // Actualizar estadísticas principales
        const dprTotal = document.getElementById('statDPRTotal');
        const hitProb = document.getElementById('statHitChance');
        const dmgPerHit = document.getElementById('statDamagePerHit');
        const critsRound = document.getElementById('statCritsPerRound');

        if (dprTotal) dprTotal.textContent = dpr.toFixed(1);
        if (hitProb) hitProb.textContent = (hitChance * 100).toFixed(1) + '%';
        if (dmgPerHit) dmgPerHit.textContent = damagePerHit.toFixed(1);
        if (critsRound) critsRound.textContent = critsPerRound.toFixed(2);

        // Actualizar turnos para derrotar
        const defeatList = document.getElementById('defeatTimesList');
        if (defeatList) {
            defeatList.innerHTML = enemies.map(enemy => {
                const turns = Math.ceil(enemy.hp / dpr);
                return `<div class="defeat-item">
                    <span class="defeat-enemy">${t(enemy.key)}</span>
                    <span class="defeat-turns">~${turns} ${t('turnsLabel')}</span>
                </div>`;
            }).join('');
        }

        // Actualizar nivel estimado
        const levelBadge = document.getElementById('levelBadge');
        if (levelBadge) {
            levelBadge.textContent = `${t('levelRange')} ${level.min}-${level.max}`;
        }
    }

    calculatePowerLevel(dpr, hitChance) {
        // Fórmula: Power Level = DPR × hit_chance × 10
        // Esto da un número único y comparable entre builds
        const powerLevel = Math.round(dpr * hitChance * 10);
        return powerLevel;
    }

    renderPowerLevel(ac, dpr, hitChance) {
        const section = document.getElementById('powerLevelSection');

        if (!section) {
            console.warn('Power level section not found');
            return;
        }

        // Calcular Power Level
        const powerLevel = this.calculatePowerLevel(dpr, hitChance);

        // Mostrar sección
        section.style.display = 'block';

        // Actualizar número principal
        const powerNumber = document.getElementById('powerLevelNumber');
        if (powerNumber) {
            powerNumber.textContent = powerLevel;
        }

        // Actualizar fórmula breakdown
        const formulaDPR = document.getElementById('formulaDPR');
        const formulaHit = document.getElementById('formulaHit');
        const formulaResult = document.getElementById('formulaResult');

        if (formulaDPR) formulaDPR.textContent = dpr.toFixed(1);
        if (formulaHit) formulaHit.textContent = (hitChance * 100).toFixed(1) + '%';
        if (formulaResult) formulaResult.textContent = powerLevel;
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
        alert(t('alertMinDice'));
        return;
    }

    button.parentElement.remove();
    calculator.updateDiceFromInputs();
}

// ========== FUNCIONES DE PERFILES ==========

let profileManager;
let profileComparator;

function saveProfile() {
    const nameInput = document.getElementById('profileName');

    // If editing, use existing profile name as default
    let defaultName = nameInput ? nameInput.value : '';
    if (profileManager.isEditing()) {
        const editingProfile = profileManager.getEditingProfile();
        if (editingProfile && !defaultName) {
            defaultName = editingProfile.name;
        }
    }

    const name = defaultName || '';

    const result = profileManager.saveProfile(name);

    if (result.success) {
        // Limpiar input
        if (nameInput) nameInput.value = '';
        // Feedback visual
        const messageKey = result.updated ? 'profileSaved' : 'profileSaved';
        showProfileFeedback(t(messageKey, { name: result.profile.name }), 'success');
    } else {
        alert(t(result.messageKey));
    }
}

function editProfile(id) {
    profileManager.startEditing(id);
    // Set the profile name in the input field
    const profile = profileManager.profiles.find(p => p.id === id);
    if (profile) {
        const nameInput = document.getElementById('profileName');
        if (nameInput) {
            nameInput.value = profile.name;
        }
    }
    // Scroll to config section
    document.querySelector('.config-panel')?.scrollIntoView({ behavior: 'smooth' });
}

function cancelEditProfile() {
    profileManager.cancelEditing();
    // Clear name input
    const nameInput = document.getElementById('profileName');
    if (nameInput) nameInput.value = '';
}

function loadProfile(id) {
    const result = profileManager.loadProfile(id);

    if (result.success) {
        showProfileFeedback(t('profileLoaded', { name: result.profile.name }), 'success');
        // Scroll hacia los resultados
        document.querySelector('.results-panel')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteProfile(id) {
    profileManager.deleteProfile(id);
}

function showProfileFeedback(message, type) {
    // Crear elemento de feedback temporal
    const feedback = document.createElement('div');
    feedback.className = `profile-feedback ${type}`;
    feedback.textContent = message;

    const profilesSection = document.querySelector('.profiles-section');
    if (profilesSection) {
        profilesSection.appendChild(feedback);

        // Remover después de 2 segundos
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }
}

// ========== FUNCIONES DE COMPARACIÓN ==========

function runComparison() {
    // Verificar que hay perfiles seleccionados
    const selectedIds = Array.from(profileComparator.selectedProfiles);

    if (selectedIds.length < 2) {
        alert(t('compareMinSelect'));
        return;
    }

    // Obtener CA objetivo
    const acInput = document.getElementById('compareTargetAC');
    const targetAC = parseInt(acInput?.value) || 15;

    // Ejecutar comparación
    const comparisonData = profileComparator.compareProfiles(selectedIds, targetAC);

    // Renderizar resultados
    profileComparator.renderComparison(comparisonData);
}

// ========== INICIALIZACIÓN ==========

let calculator;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language system first
    initializeLanguage();

    // Setup custom select with flags
    const customSelect = document.getElementById('languageSelect');
    if (customSelect) {
        const selected = customSelect.querySelector('.select-selected');
        const itemsContainer = customSelect.querySelector('.select-items');
        const items = itemsContainer.querySelectorAll('div');

        // Toggle dropdown
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllSelect(selected);
            itemsContainer.classList.toggle('select-hide');
            selected.classList.toggle('select-arrow-active');
        });

        // Handle item selection
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const lang = item.getAttribute('data-value');
                selected.innerHTML = item.innerHTML;
                itemsContainer.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');
                setLanguage(lang);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            closeAllSelect();
        });

        function closeAllSelect(except) {
            const items = document.querySelectorAll('.select-items');
            const selecteds = document.querySelectorAll('.select-selected');
            items.forEach((item, i) => {
                if (except !== selecteds[i]) {
                    item.classList.add('select-hide');
                    selecteds[i].classList.remove('select-arrow-active');
                }
            });
        }
    }

    // Initialize calculator
    calculator = new DnDCalculator();
    calculator.updateDiceNotation();

    // Initialize profile manager
    profileManager = new ProfileManager(calculator);
    profileManager.renderProfiles();

    // Initialize profile comparator
    profileComparator = new ProfileComparator(profileManager);
    profileComparator.renderCompareCheckboxes();

    // Calcular automáticamente al cargar
    calculator.calculate();
});
