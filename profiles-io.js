/*
 * profiles-io.js — Exportar / importar perfiles como JSON.
 *
 * Funciones puras, sin DOM (la lectura y descarga del archivo vive en calculator.js).
 *
 * Criterio de validación al importar:
 *   - Se RECHAZA el perfil si le falta algo que no se puede inventar sin mentir:
 *     nombre, config, config.attackBonus y config.damageDice.
 *   - Se COMPLETA lo que es puro registro: id y createdAt.
 *   - Se ACOTA lo que está bien tipado pero fuera de rango (un bono de +999 pasa a +40),
 *     y se descartan los campos desconocidos.
 * Un archivo con perfiles rotos importa los sanos y reporta los omitidos.
 *
 * Funciona como módulo CommonJS (tests en Node) y como global `DnDProfilesIO` en el navegador.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./engine.js'));
    } else {
        root.DnDProfilesIO = factory(root.DnDEngine);
    }
}(typeof self !== 'undefined' ? self : this, function (engine) {
    'use strict';

    const FORMAT = 'dnd-attack-probability-profiles';
    const VERSION = 1;
    const NAME_MAX = 80;

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    /** ¿Es un número, o una cadena que representa uno? (normalizeConfig acepta ambos) */
    function isNumeric(value) {
        if (typeof value === 'number') return Number.isFinite(value);
        if (typeof value === 'string' && value.trim() !== '') return Number.isFinite(Number(value));
        return false;
    }

    function isPlainObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    /**
     * Comprueba los campos obligatorios. Devuelve el nombre del primer campo que falta,
     * o null si el perfil se puede importar.
     */
    function missingField(raw) {
        if (!isPlainObject(raw)) return 'profile';
        if (typeof raw.name !== 'string' || raw.name.trim() === '') return 'name';
        if (!isPlainObject(raw.config)) return 'config';
        if (!isNumeric(raw.config.attackBonus)) return 'config.attackBonus';

        const dice = raw.config.damageDice;
        const diceOk = Array.isArray(dice) && dice.length > 0
            && dice.every(d => isPlainObject(d) && isNumeric(d.count) && isNumeric(d.sides));
        if (!diceOk) return 'config.damageDice';

        return null;
    }

    /**
     * Forma canónica de un perfil: sólo los campos conocidos, en orden fijo y ya saneados.
     * Exportar e importar producen exactamente esta forma, así que el round-trip es estable.
     */
    function canonicalProfile(raw) {
        const profile = {
            id: typeof raw.id === 'string' && raw.id.trim() !== '' ? raw.id.trim() : generateId(),
            name: raw.name.trim().slice(0, NAME_MAX),
            createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
            config: engine.normalizeConfig(raw.config)
        };
        if (Number.isFinite(raw.updatedAt)) profile.updatedAt = raw.updatedAt;

        // updatedAt va antes de config para que el JSON quede legible
        return profile.updatedAt === undefined
            ? profile
            : { id: profile.id, name: profile.name, createdAt: profile.createdAt, updatedAt: profile.updatedAt, config: profile.config };
    }

    /** Serializa los perfiles con un sobre que identifica formato y versión. */
    function exportProfiles(profiles, options) {
        const opts = options || {};
        return JSON.stringify({
            format: FORMAT,
            version: VERSION,
            exportedAt: opts.exportedAt || new Date().toISOString(),
            profiles: (Array.isArray(profiles) ? profiles : [])
                .filter(p => missingField(p) === null)
                .map(canonicalProfile)
        }, null, 2);
    }

    /**
     * Lee un JSON exportado (o un array pelado de perfiles escrito a mano).
     * Devuelve { ok, profiles, skipped, errorKey? }; nunca lanza.
     */
    function importProfiles(text) {
        if (typeof text !== 'string' || text.trim() === '') {
            return { ok: false, errorKey: 'importErrorEmpty', profiles: [], skipped: [] };
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return { ok: false, errorKey: 'importErrorInvalidJson', profiles: [], skipped: [] };
        }

        const list = Array.isArray(data) ? data
            : isPlainObject(data) && Array.isArray(data.profiles) ? data.profiles
            : null;
        if (!list) {
            return { ok: false, errorKey: 'importErrorFormat', profiles: [], skipped: [] };
        }

        const profiles = [];
        const skipped = [];
        list.forEach((raw, index) => {
            const field = missingField(raw);
            if (field) {
                skipped.push({ index, field, name: isPlainObject(raw) && typeof raw.name === 'string' ? raw.name : null });
            } else {
                profiles.push(canonicalProfile(raw));
            }
        });

        if (profiles.length === 0) {
            return { ok: false, errorKey: 'importErrorNoValidProfiles', profiles: [], skipped };
        }
        return { ok: true, profiles, skipped };
    }

    /**
     * Fusiona los importados con los que ya había: los nuevos van primero y, si un id
     * ya existe, el importado recibe uno nuevo (nunca se pisa un perfil guardado).
     * No muta los arrays de entrada.
     */
    function mergeProfiles(existing, incoming) {
        const current = Array.isArray(existing) ? existing : [];
        const used = new Set(current.map(p => p && p.id));

        const added = (Array.isArray(incoming) ? incoming : []).map(profile => {
            const copy = JSON.parse(JSON.stringify(profile));
            while (used.has(copy.id)) copy.id = generateId();
            used.add(copy.id);
            return copy;
        });

        return added.concat(current.map(p => JSON.parse(JSON.stringify(p))));
    }

    /** Nombre sugerido para el archivo descargado. */
    function exportFilename(date) {
        const d = date instanceof Date && !isNaN(date) ? date : new Date();
        return `perfiles-dnd-${d.toISOString().slice(0, 10)}.json`;
    }

    return {
        FORMAT,
        VERSION,
        generateId,
        exportProfiles,
        importProfiles,
        mergeProfiles,
        exportFilename
    };
}));
