import { UserContract } from "../contracts/IUser";
import { UserDTO } from "../dto/UserDTO";

export abstract class UserAbstract implements UserContract {
    id: string;
    firstname?: string;
    lastname?: string;
    pseudo?: string;
    email: string;
    password: string;
    salt: string;
    telnumber?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, email: string, password: string, salt: string, firstname?: string, lastname?: string, pseudo?: string, telnumber?: string, createdAt?: Date, updatedAt?: Date) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.salt = salt;
        this.createdAt = createdAt || new Date(); // à corriger
        this.updatedAt = updatedAt || new Date(); // à corriger
        this.firstname = firstname;
        this.lastname = lastname;
        this.pseudo = pseudo;
        this.telnumber = telnumber;
    }

    getId(): string {return this.id;}
    getFirstname(): string | null {return this.firstname;}
    getLastname(): string | null {return this.lastname;}
    getPseudo(): string | null {return this.pseudo;}
    getEmail(): string {return this.email;}
    getPassword(): string {return this.password;}
    getSalt(): string {return this.salt;}
    getTelnumber(): string | null {return this.telnumber;}
    getCreatedAt(): Date {return this.createdAt;}
    getUpdatedAt(): Date {return this.updatedAt;}

    setId(id: string): void {this.id = id;}
    setFirstname(firstname: string): void {this.firstname = firstname;}
    setLastname(lastname: string): void {this.lastname = lastname;}
    setPseudo(pseudo: string): void {this.pseudo = pseudo;}
    setEmail(email: string): void {this.email = email;}
    setPassword(password: string): void {this.password = password;}
    setSalt(salt: string): void {this.salt = salt;}
    setTelnumber(telnumber: string): void {this.telnumber = telnumber;}
    setCreatedAt(createdAt: Date): void {this.createdAt = createdAt;}
    setUpdatedAt(updatedAt: Date): void {this.updatedAt = updatedAt;}

    abstract toDto(): UserDTO;
}