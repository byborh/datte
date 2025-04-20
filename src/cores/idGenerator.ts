import { v4 as uuidv4 } from 'uuid';

export class IdGenerator {
  private static instance: IdGenerator;

  private constructor() {}

  public static getInstance(): IdGenerator {
    if (!IdGenerator.instance) {
      IdGenerator.instance = new IdGenerator();
    }
    return IdGenerator.instance;
  }

  // Generate an UUID
  public generateId(): string {
    return uuidv4();
  }
}

// Utilisation
// const idGenerator = IdGenerator.getInstance();
// const userId: string = idGenerator.generateId();
// console.log(userId); // Exemple : "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"