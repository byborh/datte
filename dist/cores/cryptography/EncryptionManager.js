"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionManager = void 0;
const crypto_1 = require("crypto");
const KeyManager_1 = require("./KeyManager");
// Gère le chiffrement et le déchiffrement
// EncryptionManager: Encrypt and decrypt sensitive data
class EncryptionManager {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyManager = KeyManager_1.KeyManager.getInstance();
    }
    static getInstance() {
        if (!EncryptionManager.instance) {
            EncryptionManager.instance = new EncryptionManager();
        }
        return EncryptionManager.instance;
    }
    encrypt(data, keyName) {
        const key = this.keyManager.getKey(keyName);
        const iv = (0, crypto_1.randomBytes)(16);
        const cipher = (0, crypto_1.createCipheriv)(this.algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        return {
            encrypted: encrypted.toString('hex'),
            iv: iv.toString('hex'),
            tag: tag.toString('hex'),
        };
    }
    decrypt(encryptedData, keyName) {
        const { encrypted, iv, tag } = encryptedData;
        const key = this.keyManager.getKey(keyName);
        const decipher = (0, crypto_1.createDecipheriv)(this.algorithm, key, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encrypted, 'hex')),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
}
exports.EncryptionManager = EncryptionManager;
