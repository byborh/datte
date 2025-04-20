import { AuthTokenRedisEntity } from "@modules/auth-token/entity/redis/AuthToken.entity";
import { IAuthTokenRepository } from "../contract/IAuthTokenRepository";
import { RedisClientType } from "redis";
import { IDatabase } from "@db/contract/IDatabase";


export class AuthTokenRepositoryRedis implements IAuthTokenRepository {
    private client: RedisClientType;
    private isInitialized: Promise<void>;

    constructor(private db: IDatabase) {
        this.client = db.getDataSource() as RedisClientType;
        this.isInitialized = this.initialize();
    }

    async initialize(): Promise<void> {
        try {
            if(!this.client.isOpen) {
                await this.client.connect();
            }
        } catch (error) {
            console.error("Failed to connect to Redis:", error);
            throw error;
        }
    }

    async createAuthToken(authToken: AuthTokenRedisEntity): Promise<AuthTokenRedisEntity> {
        try {
            await this.isInitialized;

            // Save authToken to database
            await this.client.hSet(`authToken:${authToken.id}`, authToken.toRedisHash());

            // Add id of authToken in the Set of user_authTokens
            await this.client.sAdd(`user_authTokens${authToken.user_id}`, authToken.id);
            
            // Verify if authToken created correctly
            const exists = await this.client.exists(`authToken:${authToken.id}`);
            
            // Throw error if authToken not created
            if (exists !== 1) {
                throw new Error("Failed to create auth token in Redis");
            }

            return authToken;
        } catch (error) {
            console.error("Failed to create auth token:", error);
            throw error;
        }
    }

    async getAuthTokenByUserId(userId: string): Promise<AuthTokenRedisEntity> {
        try {
            await this.isInitialized;

            const authTokens = await this.client.sMembers(`user_authTokens${userId}`);
            if(authTokens.length === 0) return null;

            // Get the first/unique authToken
            const authTokenId = authTokens[0];

            const authTokenData = await this.client.hGetAll(`authToken:${authTokenId}`);

            return Object.keys(authTokenData).length > 0 ? AuthTokenRedisEntity.fromRedisHash(authTokenData) : null;
        } catch (error) {
            console.error("Failed to get auth token by user ID:", error);
            throw error;
        }
    }

    async deleteAuthTokenByUserId(userId: string): Promise<boolean> {
        try {
            await this.isInitialized;
    
            // Get all auth token ids
            const authTokenIds = await this.client.sMembers(`user_authTokens${userId}`);
            if (authTokenIds.length === 0) return false;
    
            // Delete every token
            await Promise.all(
                authTokenIds.map(async (authTokenId) => {
                    await this.client.del(`authToken:${authTokenId}`);
                })
            );
    
            // Delete Set
            await this.client.del(`user_authTokens${userId}`);
    
            return true;
        } catch (error) {
            console.error("Failed to delete auth token by user ID:", error);
            throw error;
        }
    }

    async getAllAuthTokens(): Promise<AuthTokenRedisEntity[] | null> {
        try {
            await this.isInitialized;

            const authTokens: AuthTokenRedisEntity[] = [];
            let cursor: number = 0;

            do {
                const reply = await this.client.scan(cursor, { MATCH: "authToken:*", COUNT: 100 });
                cursor = reply.cursor;
                const keys = reply.keys;
                
                for(const key of keys) {
                    const authTokenData = await this.client.hGetAll(key);
                    authTokens.push(AuthTokenRedisEntity.fromRedisHash(authTokenData));
                }
            } while(cursor !== 0)

            return authTokens;
        } catch (error) {
            console.error("Failed to get all auth tokens:", error);
            throw error;
        }
        
    }

    async deleteAuthTokenById(authTokenId: string): Promise<boolean> {
        try {
            await this.isInitialized;
            
            const authTokenData = await this.client.hGetAll(`authToken:${authTokenId}`);
            if(Object.keys(authTokenData).length === 0) return false;

            const user_id = authTokenData.user_id;

            const authDel = await this.client.del(`authToken:${authTokenId}`);
            const userDel = await this.client.sRem(`user_authTokens${user_id}`, authTokenId);

            return authDel > 0;
        } catch (error) {
            console.error("Failed to delete auth token by ID:", error);
            throw error;
        }
    }
}