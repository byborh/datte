import { IChatAIRepository } from "../contract/IChatAIRepository";
import { RedisClientType } from "redis";
import { IDatabase } from "@db/contract/IDatabase";
import { ChatAIRedisEntity } from "@modules/chat-ai/entity/redis/ChatAI.entity";


export class ChatAIRepositoryRedis implements IChatAIRepository {
    private client: RedisClientType;
    private isInitialized: Promise<void>; // Be sure to wait for initialization

    constructor(private db: IDatabase) {
        this.client = db.getDataSource() as RedisClientType;
        this.isInitialized = this.initialize();
    }

    // Connect to database
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

    // Save chatAI to database
    async submitPrompt(chatAI: ChatAIRedisEntity): Promise<ChatAIRedisEntity> {
        try {
            await this.isInitialized; // Wait for initialization

            // Save chatAI to database
            await this.client.hSet(`chatAI:${chatAI.id}`, chatAI.toRedisHash());
            
            // Add id of chat in the Set of user_chatAIs
            await this.client.sAdd(`user_chatAIs${chatAI.user_id}`, chatAI.id);

            // Verify if chatAI created correctly
            const exists = await this.client.exists(`chatAI:${chatAI.id}`);
            return exists === 1 ? chatAI : null;
        } catch (error) {
            console.error("Error submitting prompt:", error);
            throw error;
        }
    }

    // Get all chatAIs
    async getAllChatAIs(): Promise<ChatAIRedisEntity[]> {
        try {
            await this.isInitialized; // Wait for initialization

            // Create an array to store chatAIs and a cursor
            const chatAIs: ChatAIRedisEntity[] = [];
            let cursor: number = 0;

            do {
                // Get 100 chatAIs at a time with scanning
                const reply = await this.client.scan(cursor, { MATCH: "chatAI:*", COUNT: 100 });
                cursor = reply.cursor;
                const keys = reply.keys;

                // Convert found keys to chatAIs
                for(const key of keys) {
                    const chatAIData = await this.client.hGetAll(key);
                    chatAIs.push(ChatAIRedisEntity.fromRedisHash(chatAIData));
                }
                
            } while(cursor !== 0);

            // Return all chatAIs
            return chatAIs;
        } catch (error) {
            console.error("Error getting all chatAIs:", error);
            throw error;
        }
    }

    async getChatAIById(chatAIId: string): Promise<ChatAIRedisEntity> {
        try {
            await this.isInitialized; // Wait for initialization

            // Get chatAI by id
            const chatAIData = await this.client.hGetAll(`chatAI:${chatAIId}`);
            return Object.keys(chatAIData).length > 0 ? ChatAIRedisEntity.fromRedisHash(chatAIData) : null;
        } catch (error) {
            console.error("Error getting chatAI by id:", error);
            throw error;
        }
    }

    async getChatAIsByUserId(userId: string): Promise<ChatAIRedisEntity[]> {
        try {
            await this.isInitialized; // Wait for initialization

            const chatIds = await this.client.sMembers(`user_chatAIs${userId}`);
            if(chatIds.length === 0) return null;
    
            const chats = await Promise.all(
                chatIds.map(async (id) => {
                    const chatAIData = await this.client.hGetAll(`chatAI:${id}`);
                    return ChatAIRedisEntity.fromRedisHash(chatAIData);
                })
            )
    
            return chats;
        } catch (error) {
            console.error("Error getting chatAI by user id:", error);
            throw error;
        }
    }

    async deleteChatAIById(chatAIId: string, userId: string): Promise<boolean> {
        try {
            await this.isInitialized; // Wait for initialization

            const chatDel = await this.client.del(`chatAI:${chatAIId}`);
            const userDel = await this.client.sRem(`user_chatAIs${userId}`, chatAIId);

            return chatDel > 0 || userDel > 0;
        } catch (error) {
            console.error("Error deleting chatAI:", error);
            throw error;
        }
    }
}