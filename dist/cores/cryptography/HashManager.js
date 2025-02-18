"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashManager = void 0;
const crypto_1 = require("crypto");
const KeyManager_1 = require("./KeyManager");
// Gère le hachage général et les HMAC
// HashManager: Handle general-purpose hashing and HMAC
class HashManager {
    constructor() { }
    static getInstance() {
        if (!HashManager.instance) {
            HashManager.instance = new HashManager();
        }
        return HashManager.instance;
    }
    hash(data) {
        return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
    }
    createHmac(data, keyName) {
        const key = KeyManager_1.KeyManager.getInstance().getKey(keyName);
        return (0, crypto_1.createHmac)('sha256', key).update(data).digest('hex');
    }
}
exports.HashManager = HashManager;
