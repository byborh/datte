import { IdGenerator } from "@core/idGenerator";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { AuthToken } from "@modules/auth-token/entity/AuthToken.entity";
import { AuthTokenRepositoryMySQL } from "@modules/auth-token/repositories/drivers/AuthTokenRepositoryMySQL";

export class CreateToken{
    private static instance: CreateToken;
    private authTokenRepository: AuthTokenRepositoryMySQL;

    constructor(authTokenRepository: AuthTokenRepositoryMySQL) {
        this.authTokenRepository = authTokenRepository;
    }

    public static getInstance(authTokenRepository: AuthTokenRepositoryMySQL): CreateToken {
        if(!CreateToken.instance) {
            CreateToken.instance = new CreateToken(authTokenRepository);
        }
        return CreateToken.instance;
    }

    public async createToken(userId: string, roleIds: string[]): Promise<AuthToken | null> {
        // Get the private key
        const privateKeyPath = path.join(__dirname, "../../../ec_private.pem");
        const privateKey: string = fs.readFileSync(privateKeyPath, "utf8");
        
        // Generate an ID for the token
        const idGenerator = IdGenerator.getInstance();
        const authTokenId: string = idGenerator.generateId(16);

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
        const authToken: AuthToken = new AuthToken(authTokenId, userId, token, createdAt, expiresAt);

        const tokenCreated: AuthToken = await this.authTokenRepository.createAuthToken(authToken);
        if(!tokenCreated) throw new Error("Failed to create token.");

        return authToken || null;
    }
}


/*

export class HashManager {
    private static instance: HashManager;

    private constructor() {}

    public static getInstance(): HashManager {
        if (!HashManager.instance) {
        HashManager.instance = new HashManager();
        }
      
*/