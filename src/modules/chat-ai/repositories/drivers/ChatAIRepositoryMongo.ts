import { IChatAIRepository } from "../contract/IChatAIRepository";
import { Repository } from "typeorm";
import { MongoDatabase } from "@db/drivers/mongo.datasource";
import { IDatabase } from "@db/contract/IDatabase";
import { ChatAIMongoEntity } from "@modules/chat-ai/entity/mongo/ChatAI.entity";

export class ChatAIRepositoryMongo implements IChatAIRepository {
    private repository: Repository<ChatAIMongoEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as MongoDatabase;
        this.repository = dataSource.getDataSource().getRepository(ChatAIMongoEntity);
    }

    async submitPrompt(chatAI: ChatAIMongoEntity): Promise<ChatAIMongoEntity> {
        const result = await this.repository.save(chatAI);
        return result || null;
    }

    async getAllChatAIs(): Promise<ChatAIMongoEntity[]> {
        const result = await this.repository.find();
        return result || null;
    }

    async getChatAIById(chatAIId: string): Promise<ChatAIMongoEntity> {
        const result = await this.repository.findOneBy({ id: chatAIId });
        return result || null;
    }

    async getChatAIsByUserId(userId: string): Promise<ChatAIMongoEntity[]> {
        const result: ChatAIMongoEntity[] = await this.repository.find({ where: { user_id: userId } });
        return result || null;
    }

    async deleteChatAIById(chatAIId: string): Promise<boolean> {
        const result = await this.repository.delete(chatAIId);
        return result.affected !== 0;
    }
}