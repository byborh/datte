import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { KeyManager } from './KeyManager';

// Gère le chiffrement et le déchiffrement
// EncryptionManager: Encrypt and decrypt sensitive data
export class EncryptionManager {
    private static instance: EncryptionManager;
    private readonly algorithm = 'aes-256-gcm';
    private keyManager = KeyManager.getInstance();
  
    private constructor() {}
  
    public static getInstance(): EncryptionManager {
      if (!EncryptionManager.instance) {
        EncryptionManager.instance = new EncryptionManager();
      }
      return EncryptionManager.instance;
    }
  
    public encrypt(data: string, keyName: string): { encrypted: string; iv: string; tag: string } {
      const key = this.keyManager.getKey(keyName);
      const iv = randomBytes(16);
      const cipher = createCipheriv(this.algorithm, key, iv);
  
      const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
      const tag = cipher.getAuthTag();
  
      return {
        encrypted: encrypted.toString('hex'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
      };
    }
  
    public decrypt(encryptedData: { encrypted: string; iv: string; tag: string }, keyName: string): string {
      const { encrypted, iv, tag } = encryptedData;
      const key = this.keyManager.getKey(keyName);
      const decipher = createDecipheriv(this.algorithm, key, Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, 'hex')),
        decipher.final(),
      ]);
  
      return decrypted.toString('utf8');
    }
}