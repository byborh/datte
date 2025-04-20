import express, { Request, Response, NextFunction } from "express";
import { ChatAIController } from "../controllers/ChatAIController";
import { validateAttributeMiddleware } from "@middlewares/validateAttributeMiddleware";
import { authMiddleware } from "@middlewares/authMiddleware";

export const ChatAIRoutes = (chatAIController: ChatAIController): express.Router => {
    const router = express.Router();

    // Connexion
    router.post(
        "/",
        authMiddleware(['ADMIN', 'MANAGER', 'USER']),
        validateAttributeMiddleware("body", "requestContent", "RequestContent missing or invalid in request body."),
        (req: Request, res: Response, next: NextFunction) => chatAIController.submitPrompt(req, res, next)
    );

    router.get(
        "/",
        // authMiddleware(['ADMIN']),
        (req: Request, res: Response, next: NextFunction) => chatAIController.getAllChatAIs(req, res, next)
    );

    router.get(
        "/:id",
        // authMiddleware(['ADMIN', 'MANAGER', 'USER']),
        validateAttributeMiddleware("params", "id", "Id missing or invalid in request params."),
        (req: Request, res: Response, next: NextFunction) => chatAIController.getChatAIById(req, res, next)
    );


    router.get(
        "/user/:userId",
        // authMiddleware(['ADMIN', 'MANAGER', 'USER']),
        validateAttributeMiddleware("params", "userId", "UserId missing or invalid in request params."),
        (req: Request, res: Response, next: NextFunction) => chatAIController.getChatAIsByUserId(req, res, next)
    )

    router.delete(
        "/:id",
        // authMiddleware(['ADMIN', 'MANAGER', 'USER']),
        validateAttributeMiddleware("params", "id", "Id missing or invalid in request params."),
        (req: Request, res: Response, next: NextFunction) => chatAIController.deleteChatAIById(req, res, next)
    )

    return router;
};
