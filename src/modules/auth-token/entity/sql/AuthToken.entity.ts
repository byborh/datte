import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { UserSQLEntity } from "@modules/users/entity/sql/User.entity";
import { AuthTokenAbstract } from "../AuthToken.abstract";
import { AuthTokenContract } from "@modules/auth-token/contracts/IAuthToken";


@Entity("auth_token")
export class AuthTokenSQLEntity extends AuthTokenAbstract {
    @PrimaryColumn({ type: "varchar", length: 255 })
    id: string;

    @Column({ type: "varchar", length: 255 })
    user_id: string;

    @Column({ type: "varchar", length: 512 })
    token: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    expiresAt: Date;

    @OneToOne(() => UserSQLEntity, user => user.authTokenSqlEntity, {onDelete: "CASCADE"})
    @JoinColumn({ name: "user_id" })
    user: UserSQLEntity;

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


    constructor(data?: Partial<AuthTokenContract>) {
        super(
            data?.id ?? "",
            data?.user_id ?? "",
            data?.token ?? "",
            data?.createdAt ?? new Date(),
            data?.expiresAt ?? new Date()
        );
    
        this.id = data?.id ?? "";
        this.user_id = data?.user_id ?? "";
        this.token = data?.token ?? "";
        this.createdAt = data?.createdAt ?? new Date();
        this.expiresAt = data?.expiresAt ?? new Date();
    }
    

    public getId(): string {return this.id;}
    public getUserId(): string {return this.user_id;}
    public getToken(): string {return this.token;}
    public getCreatedAt(): Date {return this.createdAt;}
    public getExpiresAt(): Date {return this.expiresAt;}

    public setId(id: string): void {this.id = id;}
    public setUserId(userId: string): void {this.user_id = userId;}
    public setToken(token: string): void {this.token = token;}
    public setCreatedAt(date: Date): void {this.createdAt = date;}
    public setExpiresAt(date: Date): void {this.expiresAt = date;}

}