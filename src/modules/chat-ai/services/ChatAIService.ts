import * as dotenv from "dotenv";
import { IdGenerator } from "@core/idGenerator";
import { IChatAIRepository } from "../repositories/contract/IChatAIRepository";
import { ChatAIAbstract } from "../entity/ChatAI.abstract";
import { createChatAIEntity } from "../entity/ChatAI.factory";
const axios = require('axios');
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

export class ChatAIService {
    private chatAIRepository: IChatAIRepository;

    constructor(chatAIRepository: IChatAIRepository) {this.chatAIRepository = chatAIRepository;}

    // Crée une requête à l'IA et stocke la réponse
    public async submitPrompt(userId: string, prompt: string): Promise<string> {
        try {
            const payload = {
                prompt: prompt,
                model: process.env.AI_MODEL || "your_model",
                stream: true,
                temperature: 0.7,
                max_tokens: 30
            };

            const combinedResponse: string = await this.sendPromptToChatAI(payload);
            if (!combinedResponse) return null;

            const idGenerator = IdGenerator.getInstance();
            const chatAIId: string = idGenerator.generateId();

            const chatAI = {
                id: chatAIId,
                user_id: userId,
                requestContent: prompt,
                responseContent: combinedResponse,
                createdAt: new Date()
            } as ChatAIAbstract;

            // Creation of entity with correct types
            const chatAIEntity = await createChatAIEntity(chatAI);

            await this.chatAIRepository.submitPrompt(chatAIEntity);

            return combinedResponse;

        } catch (error) {
            console.error("Error preparing the prompt to the Chat AI server in ChatAIService:", error);
            throw new Error("Failed to prepare the prompt to the Chat AI server.");
        }
    }

    // Send the prompt to the Chat AI server and handle the response in a stream
    private async sendPromptToChatAI(payload: object): Promise<string> {
        try {
            const apiUrl = process.env.AI_API_URL;
            const headers = {
                "Content-Type": "application/json"
            };

            const response = await axios({
                method: 'post',
                url: apiUrl,
                headers: headers,
                data: payload,
                responseType: "stream"
            });

            return new Promise((resolve, reject) => {
                let combinedResponse = '';

                response.data.on('data', (chunk: Buffer) => {
                    const strData = chunk.toString();
                    const jsonObjects = strData
                        .split('\n')
                        .filter(str => str.trim())
                        .map(line => {
                            try {
                                return JSON.parse(line);
                            } catch (e) {
                                console.error("Failed to parse chunk:", line);
                                return null;
                            }
                        })
                        .filter(obj => obj !== null);

                    jsonObjects.forEach(obj => {
                        if (obj.response) combinedResponse += obj.response;
                    });
                });

                response.data.on('end', () => {
                    resolve(combinedResponse || "No content found in response");
                });

                response.data.on('error', (err: Error) => {
                    reject(new Error(`Stream error: ${err.message}`));
                });
            });

        } catch (error) {
            console.error("Error sending the prompt to the Chat AI server in ChatAIService:", error);
            throw new Error("Error sending the prompt to the Chat AI server");
        }
    }

    public async getAllChatAIs(): Promise<ChatAIAbstract[]> {
        try {
            const chatAIs: ChatAIAbstract[] = await this.chatAIRepository.getAllChatAIs();
            if (!chatAIs || chatAIs.length === 0) return null;
            return chatAIs
        } catch (error) {
            console.error("Error finding all chatAIs in ChatAIService:", error);
            throw new Error("Failed to find chatAI.");
        }
    }

    public async getChatAIById(chatAIId: string): Promise<ChatAIAbstract> {
        try {
            if(!chatAIId || chatAIId.trim() === "") return null;

            const chatAI: ChatAIAbstract = await this.chatAIRepository.getChatAIById(chatAIId);
            if (!chatAI) return null;

            return chatAI
        } catch (error) {
            console.error("Error finding chatAI in ChatAIService:", error);
            throw new Error("Failed to find chatAI.");
        }
    }

    public async getChatAIsByUserId(userId: string): Promise<ChatAIAbstract[]> {
        try {
            if(!userId || userId.trim() === "") return null;

            const chatAI: ChatAIAbstract[] = await this.chatAIRepository.getChatAIsByUserId(userId);
            if (!chatAI) return null;

            return chatAI
        } catch (error) {
            console.error("Error finding chatAIs in ChatAIService from user id:", error);
            throw new Error("Failed to find chatAIs with user id.");
        }
    }

    public async deleteChatAIById(chatAIId: string): Promise<boolean> {
        try {
            if(!chatAIId || chatAIId.trim() === "") return false;

            const result = await this.chatAIRepository.deleteChatAIById(chatAIId);
            return result;
        } catch (error) {
            console.error("Error deleting chatAI in ChatAIService:", error);
            throw new Error("Failed to delete chatAI.");
        }
    }
}