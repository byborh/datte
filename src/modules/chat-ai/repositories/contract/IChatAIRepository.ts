import { ChatAIAbstract } from "@modules/chat-ai/entity/ChatAI.abstract";

export interface IChatAIRepository {
    submitPrompt(chatAI: ChatAIAbstract) : Promise<ChatAIAbstract>;
    getAllChatAIs() : Promise<ChatAIAbstract[]>;
    getChatAIById(chatAIId: string) : Promise<ChatAIAbstract>;
    getChatAIsByUserId(userId: string) : Promise<ChatAIAbstract[]>;
    deleteChatAIById(chatAIId: string, userId?: string) : Promise<boolean>;
}