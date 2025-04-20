import { AuthTokenContract } from "../contracts/IAuthToken";

export abstract class AuthTokenAbstract implements AuthTokenContract {
    id: string;
    user_id: string;
    token: string;
    createdAt: Date;
    expiresAt: Date;

    constructor(id: string, user_id: string, token: string, createdAt: Date, expiresAt: Date) {
        this.id = id;
        this.user_id = user_id;
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    getId(): string {return this.id;}
    getUserId(): string {return this.user_id;}
    getToken(): string {return this.token;}
    getCreatedAt(): Date {return this.createdAt;}
    getExpiresAt(): Date {return this.expiresAt;}

    setId(id: string): void {this.id = id;}
    setUserId(user_id: string): void {this.user_id = user_id;}
    setToken(token: string): void {this.token = token;}
    setCreatedAt(createdAt: Date): void {this.createdAt = createdAt;}
    setExpiresAt(expiresAt: Date): void {this.expiresAt = expiresAt;}
}