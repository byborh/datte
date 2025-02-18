import { EncryptionManager } from "./EncryptionManager";
import { KeyManager } from "./KeyManager";
import { HashManager } from "./HashManager";
import  { PasswordManager } from "./PasswordManager";

// TESTING
// --------------------------------------------------------------------------------------------------------------------------------

// Example usage
const keyManager = KeyManager.getInstance();
const encryptionManager = EncryptionManager.getInstance();
const hashManager = HashManager.getInstance();
const passwordManager = PasswordManager.getInstance();

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
