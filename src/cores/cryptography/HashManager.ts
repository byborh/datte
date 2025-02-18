import { createHash, createHmac } from 'crypto';
import { KeyManager } from './KeyManager';

// Gère le hachage général et les HMAC


// HashManager: Handle general-purpose hashing and HMAC
export class HashManager {
    private static instance: HashManager;

    private constructor() {}

    public static getInstance(): HashManager {
        if (!HashManager.instance) {
        HashManager.instance = new HashManager();
        }
        return HashManager.instance;
    }

    public hash(data: string): string {
        return createHash('sha256').update(data).digest('hex');
    }

    public createHmac(data: string, keyName: string): string {
        const key = KeyManager.getInstance().getKey(keyName);
        return createHmac('sha256', key).update(data).digest('hex');
    }
}