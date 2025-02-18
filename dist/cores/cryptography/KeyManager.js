"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManager = void 0;
const crypto_1 = require("crypto");
// Gère les clés de chiffrement
// KeyManager: Manage encryption keys
class KeyManager {
    constructor() {
        this.keys = new Map();
    }
    static getInstance() {
        if (!KeyManager.instance) {
            KeyManager.instance = new KeyManager();
        }
        return KeyManager.instance;
    }
    generateKey(name, length = 32) {
        const key = (0, crypto_1.randomBytes)(length);
        this.keys.set(name, key);
        return key;
    }
    getKey(name) {
        const key = this.keys.get(name);
        if (!key) {
            throw new Error(`Key with name \"${name}\" not found.`);
        }
        return key;
    }
}
exports.KeyManager = KeyManager;
