import { UserDTO } from '@modules/users/dto/UserDTO';
import { UserAbstract } from '../User.abstract';
import { UserContract } from '@modules/users/contracts/IUser';

export class UserRedisEntity extends UserAbstract {
    id: string;
    firstname?: string | null;
    lastname?: string | null;
    pseudo?: string | null;
    email: string;
    password: string;
    telnumber?: string | null;
    salt: string;
    createdAt: Date;
    updatedAt: Date;

    data: Record<string, any> | null;

    constructor(data: Partial<UserContract>) {
        super(data.id!, data.email, data.password, data.salt, data.firstname, data.lastname, data.pseudo, data.telnumber, data.createdAt, data.updatedAt);

        this.id = data.id!;
        this.email = data.email!;
        this.password = data.password!;
        this.salt = data.salt!;
        this.firstname = data.firstname ?? null;
        this.lastname = data.lastname ?? null;
        this.pseudo = data.pseudo ?? null;
        this.telnumber = data.telnumber ?? null;
        this.createdAt = data.createdAt ?? new Date();
        this.updatedAt = data.updatedAt ?? new Date();
    }

    // constructor(data: Partial<UserRedisEntity>) {
    //     Object.assign(this, data); // il faut commenter pour comprendre ce que c'est
    // }


    // Convert object to Redis hash
    toRedisHash(): { [key: string]: string } {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
            salt: this.salt,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            firstname: this.firstname ?? "",
            lastname: this.lastname ?? "",
            pseudo: this.pseudo ?? "",
            telnumber: this.telnumber ?? ""
        };
    }


    // Convert Redis hash to object
    static fromRedisHash(hash: { [key: string]: string }): UserRedisEntity {
        return new UserRedisEntity({
            id: hash.id,
            email: hash.email,
            password: hash.password,
            salt: hash.salt,
            createdAt: hash.createdAt ? new Date(hash.createdAt) : new Date(),
            updatedAt: hash.updatedAt ? new Date(hash.updatedAt) : new Date(),
            firstname: hash.firstname || null,
            lastname: hash.lastname || null,
            pseudo: hash.pseudo || null,
            telnumber: hash.telnumber || null
        });
    }

    getId(): string {return this.id;}
    getFirstname(): string | null {return this.firstname;}
    getLastname(): string | null {return this.lastname;}
    getPseudo(): string | null {return this.pseudo;}
    getEmail(): string {return this.email;}
    getPassword(): string {return this.password;}
    getTelnumber(): string | null {return this.telnumber;}
    getSalt(): string | null {return this.salt;}
    getCreatedAt(): Date {return this.createdAt;}
    getUpdatedAt(): Date {return this.updatedAt;}
    
    setId(id: string): void {this.id = id;}
    setFirstname(firstname: string): void {this.firstname = firstname;}
    setLastname(lastname: string): void {this.lastname = lastname;}
    setPseudo(pseudo: string): void {this.pseudo = pseudo;}
    setEmail(email: string): void {this.email = email;}
    setPassword(password: string): void {this.password = password;}
    setTelnumber(telnumber: string): void {this.telnumber = telnumber;}
    setSalt(salt: string): void {this.salt = salt;}
    setCreatedAt(date: Date): void {this.createdAt = date;}
    setUpdatedAt(date: Date): void {this.updatedAt = date;}

    toDto(): UserDTO {
        return {
            id: this.id,
            email: this.email,
            firstname: this.firstname || null,
            lastname: this.lastname || null,
            pseudo: this.pseudo || null,
            telnumber: this.telnumber || null,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}