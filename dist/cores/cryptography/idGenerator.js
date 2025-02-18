"use strict";
/**
 * This class provides a singleton utility for generating unique IDs.
 * The IDs are created using a SHA-256 hash of random data, ensuring uniqueness and security.
 *
 * Key features:
 * - Singleton pattern: Ensures only one instance of the IdGenerator exists in the application.
 * - Secure ID generation: Combines random bytes and SHA-256 hashing to produce IDs.
 * - Shortened output: The generated ID is truncated for convenience, retaining its uniqueness.
 *
 * Usage:
 * 1. Access the generator via `IdGenerator.getInstance()`.
 * 2. Call the `generateId()` method to obtain a new unique ID.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdGenerator = void 0;
const crypto_1 = require("crypto");
class IdGenerator {
    constructor() {
    }
    static getInstance() {
        if (!IdGenerator.instance) {
            IdGenerator.instance = new IdGenerator();
        }
        return IdGenerator.instance;
    }
    // Générer un ID plus court, basé sur un hash SHA-256 de données aléatoires
    generateId(length) {
        // Générer des données aléatoires pour garantir l'unicité
        const randomData = (0, crypto_1.randomBytes)(length).toString('hex'); // Ex: 16 octets = 32 caractères hexadécimaux
        // Créer un hash SHA-256 à partir de ces données aléatoires
        const hash = (0, crypto_1.createHash)('sha256').update(randomData).digest('base64');
        // Retourner une version raccourcie de l'ID, par exemple en prenant les 16 premiers caractères.
        return hash.replace(/\+/g, '').replace(/\//g, '').substring(0, length);
    }
}
exports.IdGenerator = IdGenerator;
// Utilisation
// const idGenerator = IdGenerator.getInstance();
// const uniqueId = idGenerator.generateId();
// console.log(uniqueId); // Exemple : "eFJj9lHVZbQtY0Ep"
