"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EncryptionManager_1 = require("./EncryptionManager");
const KeyManager_1 = require("./KeyManager");
const HashManager_1 = require("./HashManager");
const PasswordManager_1 = require("./PasswordManager");
// TESTING
// --------------------------------------------------------------------------------------------------------------------------------
// Example usage
const keyManager = KeyManager_1.KeyManager.getInstance();
const encryptionManager = EncryptionManager_1.EncryptionManager.getInstance();
const hashManager = HashManager_1.HashManager.getInstance();
const passwordManager = PasswordManager_1.PasswordManager.getInstance();
// Generate keys for encryption and HMAC
keyManager.generateKey('encryptionKey');
keyManager.generateKey('hmacKey');
// Password management
const salt = passwordManager.generateSalt();
const hashedPassword = passwordManager.hashPassword('MySecurePassword!', salt);
console.log('Salt:', salt);
console.log('Hashed Password:', hashedPassword);
const isValid = passwordManager.verifyPassword('MySecurePassword!', salt, hashedPassword);
console.log('Password is valid:', isValid);
