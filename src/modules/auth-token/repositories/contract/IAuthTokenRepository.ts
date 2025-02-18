import { AuthToken } from "@modules/auth-token/entity/AuthToken.entity";

export interface IAuthTokenRepository {
    createAuthToken(authToken: AuthToken) : Promise<AuthToken>;
    getAuthTokenByUserId(userId: string): Promise<AuthToken | null>;
    deleteAuthTokenByUserId(userId: string): Promise<boolean>;

    // Only for Admin
    getAllAuthTokens(): Promise<AuthToken[] | null>;
    deleteAuthTokenById(authTokenId: string): Promise<boolean>;
}