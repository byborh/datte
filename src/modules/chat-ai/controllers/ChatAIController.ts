import { Request, Response, NextFunction } from "express";
import { ChatAIService } from "../services/ChatAIService";

export class ChatAIController {
    private chatAIService: ChatAIService;

    constructor(chatAIService: ChatAIService) {
        this.chatAIService = chatAIService;
    }

    public async submitPrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { requestContent } = req.body;

            // Get user id
            const userId: string = (req as any).user.id;
    
            if (!requestContent || requestContent.trim() === "") {
                res.status(400).json({ error: "Request content is required." });
                return;
            }
    
            // Create chatAI
            const chat = await this.chatAIService.submitPrompt(userId, requestContent);
    
            if (!chat) {
                res.status(400).json({ error: "Request could not be processed to the Chat AI." });
                return;
            }
    
            res.status(201).json({ chat });
        } catch (error) {
            next(error);
        }
    }

    public async getAllChatAIs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chatAIs = await this.chatAIService.getAllChatAIs();
            if (!chatAIs || chatAIs.length === 0) {
                res.status(404).json({ error: "No Chat with AI found." });
                return;
            }

            res.status(200).json(chatAIs);
        } catch (error) {
            next(error);
        }
    }


    public async getChatAIById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chatAIId = req.params.id;
            if(!chatAIId || chatAIId.trim() === "") {
                res.status(400).json({ error: "Chat AI ID is required." });
                return;
            }

            const chatAI = await this.chatAIService.getChatAIById(chatAIId);
            if (!chatAI) {
                res.status(404).json({ error: "No Chat with AI found with this ID." });
                return;
            }

            res.status(200).json(chatAI);
        } catch (error) {
            next(error);
        }
    }


    public async getChatAIsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            if(!userId || userId.trim() === "") {
                res.status(400).json({ error: "User ID is required." });
                return;
            }

            const chatAI = await this.chatAIService.getChatAIsByUserId(userId);
            if (!chatAI) {
                res.status(404).json({ error: "No Chat with AI found with this user ID." });
                return;
            }

            res.status(200).json(chatAI);
        } catch (error) {
            next(error);
        }
    }

    public async deleteChatAIById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const chatAIId = req.params.id;
            if(!chatAIId || chatAIId.trim() === "") {
                res.status(400).json({ error: "Chat AI ID is required." });
                return;
            }

            const result = await this.chatAIService.deleteChatAIById(chatAIId);
            if (!result) {
                res.status(404).json({ error: "No Chat with AI found with this ID." }); 
                return;
            }

            res.status(200).json({ message: "Chat with AI deleted successfully." });
        } catch (error) {
            next(error);
        }
    }
}
