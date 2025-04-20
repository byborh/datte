import { AuthTokenContract } from "@modules/auth-token/contracts/IAuthToken";
import { AuthTokenAbstract } from "../AuthToken.abstract";


export class AuthTokenRedisEntity extends AuthTokenAbstract {
    id: string;
    user_id: string;
    token: string;
    createdAt: Date;
    expiresAt: Date;

    constructor(data: Partial<AuthTokenContract>) {
        super(data.id, data.user_id, data.token, data.createdAt, data.expiresAt);
        this.id = data.id;
        this.user_id = data.user_id;
        this.token = data.token;
        this.createdAt = data.createdAt;
        this.expiresAt = data.expiresAt;
    }

    // Convert object to Redis hash
    toRedisHash(): { [keys: string]: string } {
        return {
            id: this.id,
            user_id: this.user_id,
            token: this.token,
            createdAt: this.createdAt.toISOString(),
            expiresAt: this.expiresAt.toISOString()
        }
    }

    // Convert Redis hash to object
    static fromRedisHash(hash: { [key: string]: string}) {
        return new AuthTokenRedisEntity({
            id: hash.id,
            user_id: hash.user_id,
            token: hash.token,
            createdAt: new Date(hash.createdAt),
            expiresAt: new Date(hash.expiresAt)
        })
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