import { AuthTokenAbstract } from "@modules/auth-token/entity/AuthToken.abstract";

export interface IAuthTokenRepository {
    createAuthToken(authToken: AuthTokenAbstract) : Promise<AuthTokenAbstract>;
    getAuthTokenByUserId(userId: string): Promise<AuthTokenAbstract | null>;
    deleteAuthTokenByUserId(userId: string): Promise<boolean>;

    // Only for Admin
    getAllAuthTokens(): Promise<AuthTokenAbstract[] | null>;
    deleteAuthTokenById(authTokenId: string): Promise<boolean>;
}