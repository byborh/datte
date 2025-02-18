/**
 * This class provides a singleton utility for generating unique IDs.
 * The IDs are created using a SHA-256 hash of random data, ensuring uniqueness and security.
 * 
 * Key features:
 * - Singleton pattern: Ensures only one instance of the IdGenerator exists in the application.
 * - Secure ID generation: Combines random bytes and SHA-256 hashing to produce IDs.
 * - Shortened output: The generated ID is truncated for convenience, retaining its uniqueness.
 * 
 * Usage:
 * 1. Access the generator via `IdGenerator.getInstance()`.
 * 2. Call the `generateId()` method to obtain a new unique ID.
 */

import { randomBytes, createHash } from 'crypto';

export class IdGenerator {
  private static instance: IdGenerator;

  private constructor() {
  }

  public static getInstance(): IdGenerator {
    if (!IdGenerator.instance) {
      IdGenerator.instance = new IdGenerator();
    }
    return IdGenerator.instance;
  }

  // Générer un ID plus court, basé sur un hash SHA-256 de données aléatoires
  public generateId(length: number): string {
    // Générer des données aléatoires pour garantir l'unicité
    const randomData = randomBytes(length).toString('hex'); // Ex: 16 octets = 32 caractères hexadécimaux

    // Créer un hash SHA-256 à partir de ces données aléatoires
    const hash = createHash('sha256').update(randomData).digest('base64');

    // Retourner une version raccourcie de l'ID, par exemple en prenant les 16 premiers caractères.
    return hash.replace(/\+/g, '').replace(/\//g, '').substring(0, length);
  }
}

// Utilisation
// const idGenerator = IdGenerator.getInstance();
// const uniqueId = idGenerator.generateId();
// console.log(uniqueId); // Exemple : "eFJj9lHVZbQtY0Ep"