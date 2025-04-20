import { IUserRepository } from "../contract/IUserRepository";
import { IDatabase } from "@db/contract/IDatabase";
import { RedisClientType } from "redis";
import { UserRedisEntity } from "@modules/users/entity/redis/User.entity";

export class UserRepositoryRedis implements IUserRepository {
    private client: RedisClientType;
    private isInitialized: Promise<void>; // Be sure to wait for initialization
    
    constructor(private db: IDatabase) {
        this.client = db.getDataSource() as RedisClientType;
        this.isInitialized = this.initialize();
    }

    // Connect to database
    async initialize(): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    async findUserByField(field: string, value: string): Promise<UserRedisEntity | null> {
        return null; // Don't use this method
    }

    async findUserById(userId: string): Promise<UserRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            const userData = await this.client.hGetAll(`user:${userId}`);

            return Object.keys(userData).length > 0 ? UserRedisEntity.fromRedisHash(userData) : null;
        } catch (error) {
            console.error("Failed to find user by field:", error);
            throw error;
        }
    }

    async findUserByEmail(email: string): Promise<UserRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            const userId = await this.client.hGet(`user_index`, `email:${email}`);
            if(!userId) return null;

            const userData = await this.client.hGetAll(`user:${userId}`);
            return Object.keys(userData).length > 0 ? UserRedisEntity.fromRedisHash(userData) : null;
        } catch (error) {
            console.error("Failed to find user by email:", error);
            throw error;
        }
    }

    async getAllUsers(): Promise<UserRedisEntity[]> {
        try {
            await this.isInitialized; // Wait for initialization
            const users: UserRedisEntity[] = [];
            let cursor: number = 0;

            do {
                const reply = await this.client.scan(cursor, { MATCH: "user:*", COUNT: 100});
                cursor = reply.cursor;
                const keys = reply.keys;

                for(const key of keys) {
                    const userData = await this.client.hGetAll(key);
                    users.push(UserRedisEntity.fromRedisHash(userData))
                }
        
            } while(cursor !== 0);
    
            return users;
        } catch (error) {
            console.error("Failed to find all users:", error);
            throw error;
        }
    }

    async createUser(user: UserRedisEntity): Promise<UserRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            await this.client.hSet(`user:${user.id}`, user.toRedisHash());

            // Create an index in email
            await this.client.hSet(`user_index`, `email:${user.email}`, user.id);

            // Verify if user was created
            const exists = await this.client.exists(`user:${user.id}`);
            
            return exists === 1 ? user : null;
        } catch (error) {
            console.error("Failed to create user:", error);
            throw error;
        }
    }

    async modifyUser(user: UserRedisEntity): Promise<UserRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            await this.client.hSet(`user:${user.id}`, user.toRedisHash());

            // Update the index in email
            await this.client.hDel("user_index", `email:${user.email}`);
            await this.client.hSet(`user_index`, `email:${user.email}`, user.id);

            const exists = await this.client.exists(`user:${user.id}`);
            
            return exists === 1 ? user : null;
        } catch (error) {
            console.error("Failed to modify user:", error);
            throw error;
        }
    }

    async deleteUser(userId: string): Promise<boolean> {
        try {
            await this.isInitialized; // Wait for initialization

            // stock email of user in constant
            const email = await this.client.hGet(`user:${userId}`, "email");

            // Delete the User
            const userDel = await this.client.del(`user:${userId}`);

            // Delete user roles of user
            const userRolesDel = await this.client.del(`user_roles:${userId}`);

            // Delete user index
            const userIndexDel = await this.client.hDel("user_index", `email:${email}`);

            return userDel > 0 || userRolesDel > 0 || userIndexDel > 0;
        } catch (error) {
            console.error("Failed to delete user:", error);
            throw error;
        }
    }
}