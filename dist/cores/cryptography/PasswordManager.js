"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordManager = void 0;
const crypto_1 = require("crypto");
const idGenerator_1 = require("../idGenerator");
// Gère les mots de passe
// PasswordManager: Secure password management
class PasswordManager {
    constructor() { }
    static getInstance() {
        if (!PasswordManager.instance) {
            PasswordManager.instance = new PasswordManager();
        }
        return PasswordManager.instance;
    }
    hashPassword(password, salt) {
        const iterations = 100000; // Number of iterations
        const keyLength = 64; // Length of the hash in bytes
        const hash = (0, crypto_1.pbkdf2Sync)(password, salt, iterations, keyLength, 'sha512');
        return hash.toString('hex');
    }
    generateSalt() {
        const idGenerator = idGenerator_1.IdGenerator.getInstance();
        return idGenerator.generateId(16);
    }
    verifyPassword(password, salt, hash) {
        const hashedPassword = this.hashPassword(password, salt);
        return hashedPassword === hash;
    }
}
exports.PasswordManager = PasswordManager;
