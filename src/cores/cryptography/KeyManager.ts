import { randomBytes } from 'crypto';


// Gère les clés de chiffrement
// KeyManager: Manage encryption keys
export class KeyManager {
    private static instance: KeyManager;
    private keys: Map<string, Buffer> = new Map();
  
    private constructor() {}
  
    public static getInstance(): KeyManager {
      if (!KeyManager.instance) {
        KeyManager.instance = new KeyManager();
      }
      return KeyManager.instance;
    }
  
    public generateKey(name: string, length: number = 32): Buffer {
      const key = randomBytes(length);
      this.keys.set(name, key);
      return key;
    }
  
    public getKey(name: string): Buffer {
      const key = this.keys.get(name);
      if (!key) {
        throw new Error(`Key with name \"${name}\" not found.`);
      }
      return key;
    }
  }