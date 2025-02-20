import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { UserContract } from '../contracts/IUser';
import { UserRoles } from "@modules/user-roles/entity/UserRoles.entity";
import { AuthToken } from "@modules/auth-token/entity/AuthToken.entity";

@Entity("users")
export class User implements UserContract {
    @PrimaryColumn({ type: "varchar", length: 255 })
    id: string;

    @Column({ nullable: true, name: "first_name" })
    firstname?: string | null;

    @Column({ nullable: true, name: "last_name" })
    lastname?: string | null;

    @Column({ nullable: true })
    pseudo?: string | null;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, name: "tel_number" })
    telnumber?: string | null;

    @Column()
    salt: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @Column("json", { nullable: true })
    data: JSON | null;

    @OneToMany(() => UserRoles, userRole => userRole.user, { cascade: true })
    userRoles: UserRoles[];

    @OneToOne(() => AuthToken, authToken => authToken.user) 
    authToken: AuthToken;

    /*
    ----------------------------------------------------------------------------------
        Add liaisons here with other Entities
        Ex :
            - @OneToMany
                entityName: EntityName
            - @OneToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
    ----------------------------------------------------------------------------------
    */

    // Static constructor
    constructor(params?: UserContract) {
        if (params) {
            if (!params.id) throw new Error("ID is required");
            if (!params.email || !params.email.includes('@')) throw new Error("Invalid email");

            // Verify the password ONLY at creation
            if (params.password && params.password.length < 8) throw new Error("Password must be at least 8 characters");
    
            this.id = params.id;
            this.email = params.email;
            this.password = params.password || "";
            this.salt = params.salt || "";
            this.firstname = params.firstname || null;
            this.lastname = params.lastname || null;
            this.pseudo = params.pseudo || null;
            this.telnumber = params.telnumber || null;
        }
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getFirstname(): string | null {
        return this.firstname;
    }

    setFirstname(firstname: string): void {
        this.firstname = firstname;
    }

    getLastname(): string | null {
        return this.lastname;
    }

    setLastname(lastname: string): void {
        this.lastname = lastname;
    }

    getPseudo(): string | null {
        return this.pseudo;
    }

    setPseudo(pseudo: string): void {
        this.pseudo = pseudo;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getTelnumber(): string | null {
        return this.telnumber;
    }

    setTelnumber(telnumber: string): void {
        this.telnumber = telnumber;
    }

    getSalt(): string | null {
        return this.salt;
    }

    setSalt(salt: string): void {
        this.salt = salt;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    setCreatedAt(date: Date): void {
        this.createdAt = date;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setUpdatedAt(date: Date): void {
        this.updatedAt = date;
    }
}