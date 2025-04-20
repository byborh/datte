import { Request, Response, NextFunction } from "express";
import { AuthTokenService } from "../services/AuthTokenService";

export class AuthTokenController {
    private authTokenService: AuthTokenService;

    constructor(authTokenService: AuthTokenService) {
        this.authTokenService = authTokenService;
    }

    public async createAuthToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
    
            if (!email || !password) {
                res.status(400).json({ error: "Email and password are required." });
                return;
            }
    
            // Appel au service pour générer le token
            const token = await this.authTokenService.createAuthToken(email, password);
    
            if (!token) {
                res.status(400).json({ error: "Authentication failed." });
                return;
            }
    
            res.status(201).json({ token });
        } catch (error) {
            next(error);
        }
    }


    // Logout
    public async deleteAuthToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authTokenId = (req as any).user.tokenId; // Récupéré via le middleware

            const deletedToken = await this.authTokenService.deleteAuthTokenById(authTokenId);
            if (!deletedToken) {
                res.status(404).json({ error: "AuthToken not found or could not be deleted." });
                return;
            }
    
            res.status(200).json({ message: "Logged out successfully." });
        } catch (error) {
            next(error);
        }
    }


    // Récupérer l'AuthToken d'un utilisateur via son ID
    public async getAuthTokenByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string = req.params.userId;
            if (!userId) {
                res.status(400).json({ error: "UserId is required in request params." });
                return;
            }

            const authToken = await this.authTokenService.getAuthTokenByUserId(userId);
            if (!authToken) {
                res.status(404).json({ error: "AuthToken not found for the given user." });
                return;
            }

            res.status(200).json(authToken);
        } catch (error) {
            next(error);
        }
    }

    // Supprimer l'AuthToken d'un utilisateur via son ID
    public async deleteAuthTokenByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string = req.params.userId;
            if (!userId) {
                res.status(400).json({ error: "UserId is required in request params." });
                return;
            }

            const isDeleted = await this.authTokenService.deleteAuthTokenByUserId(userId);
            if (!isDeleted) {
                res.status(404).json({ error: "AuthToken not found or could not be deleted for the given user." });
                return;
            }

            res.status(200).json({ message: "AuthToken deleted successfully." });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer tous les AuthTokens (pour l'administration)
    public async getAllAuthTokens(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authTokens = await this.authTokenService.getAllAuthTokens();
            if (!authTokens || authTokens.length === 0) {
                res.status(404).json({ error: "No AuthTokens found." });
                return;
            }

            res.status(200).json(authTokens);
        } catch (error) {
            next(error);
        }
    }

    // Supprimer un AuthToken via son ID (pour l'administration)
    public async deleteAuthTokenById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authTokenId: string = req.params.authTokenId;
            if (!authTokenId) {
                res.status(400).json({ error: "AuthToken id is required in request params." });
                return;
            }

            const isDeleted = await this.authTokenService.deleteAuthTokenById(authTokenId);
            if (!isDeleted) {
                res.status(404).json({ error: "AuthToken not found or could not be deleted." });
                return;
            }

            res.status(200).json({ message: "AuthToken deleted successfully." });
        } catch (error) {
            next(error);
        }
    }
}
