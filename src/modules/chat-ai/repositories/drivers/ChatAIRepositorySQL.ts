import { IChatAIRepository } from "../contract/IChatAIRepository";
import { Repository } from "typeorm";
import { SQLDatabase } from "@db/drivers/sql.datasource";
import { IDatabase } from "@db/contract/IDatabase";
import { ChatAISQLEntity } from "@modules/chat-ai/entity/sql/ChatAI.entity";

export class ChatAIRepositorySQL implements IChatAIRepository {
    private repository: Repository<ChatAISQLEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as SQLDatabase;
        this.repository = dataSource.getDataSource().getRepository(ChatAISQLEntity);
    }

    async submitPrompt(chatAI: ChatAISQLEntity): Promise<ChatAISQLEntity> {
        const result = await this.repository.save(chatAI);
        return result || null;
    }

    async getAllChatAIs(): Promise<ChatAISQLEntity[]> {
        const result = await this.repository.find();
        return result || null;
    }

    async getChatAIById(chatAIId: string): Promise<ChatAISQLEntity> {
        const result = await this.repository.findOneBy({ id: chatAIId });
        return result || null;
    }


    async getChatAIsByUserId(userId: string): Promise<ChatAISQLEntity[]> {
        const result: ChatAISQLEntity[] = await this.repository.find({  where: { user_id: userId } });
        return result || null;
    }

    async deleteChatAIById(chatAIId: string): Promise<boolean> {
        const result = await this.repository.delete(chatAIId);
        return result.affected !== 0;
    }
}
