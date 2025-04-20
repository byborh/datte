import { IdGenerator } from "@core/idGenerator";
import { AuthTokenAbstract } from "@modules/auth-token/entity/AuthToken.abstract";
import { createAuthTokenEntity } from "@modules/auth-token/entity/AuthToken.factory";
import { IAuthTokenRepository } from "@modules/auth-token/repositories/contract/IAuthTokenRepository";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";

export class CreateToken{
    private static instance: CreateToken;
    private authTokenRepository: IAuthTokenRepository;

    constructor(authTokenRepository: IAuthTokenRepository) {
        this.authTokenRepository = authTokenRepository;
    }

    public static getInstance(authTokenRepository: IAuthTokenRepository): CreateToken {
        if(!CreateToken.instance) {
            CreateToken.instance = new CreateToken(authTokenRepository);
        }
        return CreateToken.instance;
    }

    public async createToken(userId: string, roleIds: string[]): Promise<AuthTokenAbstract | null> {
        // Get the private key
        const privateKeyPath = path.join(__dirname, "../../../ec_private.pem");
        const privateKey: string = fs.readFileSync(privateKeyPath, "utf8");
        
        // Generate an ID for the token
        const idGenerator = IdGenerator.getInstance();
        const authTokenId: string = idGenerator.generateId();

        // Definition of dates
        const createdAt: Date = new Date();
        const expiresAt: Date = new Date(createdAt.getTime() + 3600 * 1000); // Expiration dans 1h

        // Payload of JWT
        const payload = {
            sub: userId,        // ID of user
            jti: authTokenId,  // JWT ID unique
            iat: Math.floor(createdAt.getTime() / 1000), // Issued At
            exp: Math.floor(expiresAt.getTime() / 1000), // Expiration
            role: roleIds        // ID of role
        };

        // Generation of JWT signed with ES256
        const token = jwt.sign(payload, privateKey, {
            algorithm: "ES256",
        });

        // Stock the token ID in the database
        const authToken = {
            id: authTokenId,
            user_id: userId,
            token: token,
            createdAt: createdAt,
            expiresAt: expiresAt
        } as AuthTokenAbstract;

        const authTokenEntity = await createAuthTokenEntity(authToken);

        const tokenCreated: AuthTokenAbstract = await this.authTokenRepository.createAuthToken(authTokenEntity);
        if(!tokenCreated) throw new Error("Failed to create token.");

        return authToken || null;
    }
}