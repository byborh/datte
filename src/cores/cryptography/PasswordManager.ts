import { pbkdf2Sync, randomBytes } from 'crypto';
import { IdGenerator } from '../idGenerator';

// Gère les mots de passe


// PasswordManager: Secure password management
export class PasswordManager {
    private static instance: PasswordManager;

    private constructor() {}

    public static getInstance(): PasswordManager {
        if (!PasswordManager.instance) {
        PasswordManager.instance = new PasswordManager();
        }
        return PasswordManager.instance;
    }

    public hashPassword(password: string, salt: string): string {
        const iterations = 100000; // Number of iterations
        const keyLength = 64; // Length of the hash in bytes
        const hash = pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
        return hash.toString('hex');
    }

    public generateSalt(length: number = 16): string {
        const saltBytes = randomBytes(length);
        return saltBytes.toString('hex');
      }

    public verifyPassword(password: string, salt: string, hash: string): boolean {
        const hashedPassword = this.hashPassword(password, salt);
        return hashedPassword === hash;
    }
}