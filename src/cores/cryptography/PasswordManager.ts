import { pbkdf2Sync } from 'crypto';
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

    public generateSalt(): string {
        const idGenerator = IdGenerator.getInstance();
        return idGenerator.generateId(16);
    }

    public verifyPassword(password: string, salt: string, hash: string): boolean {
        const hashedPassword = this.hashPassword(password, salt);
        return hashedPassword === hash;
    }
}