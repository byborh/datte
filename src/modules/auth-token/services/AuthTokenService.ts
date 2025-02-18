import { UserRepositoryMySQL } from "@modules/users/repositories/drivers/UserRepositoryMySQL";
import { AuthToken } from "../entity/AuthToken.entity";
import { AuthTokenRepositoryMySQL } from "../repositories/drivers/AuthTokenRepositoryMySQL";
import { PasswordManager } from "@core/cryptography/PasswordManager";
import { UserRolesRepositoryMySQL } from "@modules/user-roles/repositories/drivers/UserRolesRepositoryMySQL";
import { UserRoles } from "@modules/user-roles/entity/UserRoles.entity";
import { CreateToken } from "@core/auth/createToken";

export class AuthTokenService {
    private authTokenRepository: AuthTokenRepositoryMySQL;
    private userRepository: UserRepositoryMySQL;
    private userRoleRepository: UserRolesRepositoryMySQL;

    constructor(authTokenRepository: AuthTokenRepositoryMySQL, userRepository: UserRepositoryMySQL, userRoleRepository: UserRolesRepositoryMySQL) {
        this.authTokenRepository = authTokenRepository;
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
    }

    // Create authToken
    public async createAuthToken(email: string, password: string): Promise<string> {
        // Validation of email and password
        const user = await this.userRepository.findUserByEmail(email);

        // Verify if the password is correct
        if (user) {
            const passwordManager = PasswordManager.getInstance();
            const isPasswordValid: boolean = passwordManager.verifyPassword(
                password,
                user.getSalt(),
                user.getPassword()
            );

            // If password is different
            if (!isPasswordValid) {throw new Error("Invalid credentials : password is different");}
        } else {throw new Error("Invalid credentials : user not found");}

        // Verify if user has already a token
        const isAuthTokenExists = await this.authTokenRepository.getAuthTokenByUserId(user.getId());

        if(isAuthTokenExists) {
            const isAuthTokenDeleted = await this.authTokenRepository.deleteAuthTokenByUserId(user.getId());

            if(!isAuthTokenDeleted) throw new Error("Failed to delete existant AuthToken.");
        }

        const userId: string = user.getId();

        // Get ID of roles
        const userRoles: UserRoles[] = await this.userRoleRepository.getUserRolesByMultipleFields(["user_id"], [userId]);
        if (!userRoles || userRoles.length === 0) throw new Error("User does not have a role.");

        const roleIds: string[] = userRoles.map(userRole => userRole.getRole_id());

        // Dependencies
        const authTokenRepository = new AuthTokenRepositoryMySQL();
    
        const createToken = CreateToken.getInstance(authTokenRepository);
        const authToken: AuthToken = await createToken.createToken(userId, roleIds);

        return authToken.getToken();
    }

    // Logout
    public async deleteAuthToken(): Promise<boolean> {
        // Décoder le token

        // Récupérer l'id d'user

        // Appeler la méthode "deleteAuthTokenByUserId"

        // Retourner true ou false
        return true;
    }

    // Récupérer un AuthToken par userId
    public async getAuthTokenByUserId(userId: string): Promise<AuthToken | null> {
        try {
            if (!userId) {throw new Error("User ID is required.");}

            const authToken = await this.authTokenRepository.getAuthTokenByUserId(userId);
            if (!authToken) {throw new Error("AuthToken not found.");}

            return authToken;
        } catch (error) {
            console.error("Error finding AuthToken in AuthTokenService:", error);
            throw new Error("Failed to find AuthToken.");
        }
    }

    // Supprimer un AuthToken par userId
    public async deleteAuthTokenByUserId(userId: string): Promise<boolean> {
        try {
            if (!userId) {throw new Error("User ID is required.");}

            const isDeleted = await this.authTokenRepository.deleteAuthTokenByUserId(userId);
            return isDeleted;
        } catch (error) {
            console.error("Error deleting AuthToken in AuthTokenService:", error);
            throw new Error("Failed to delete AuthToken.");
        }
    }

    // Récupérer tous les AuthTokens (administration)
    public async getAllAuthTokens(): Promise<AuthToken[] | null> {
        try {
            const authTokens = await this.authTokenRepository.getAllAuthTokens();
            if (!authTokens || authTokens.length === 0) {
                return null;
            }
            return authTokens;
        } catch (error) {
            console.error("Error fetching all AuthTokens in AuthTokenService:", error);
            throw new Error("Failed to retrieve AuthTokens.");
        }
    }

    // Supprimer un AuthToken par son ID
    public async deleteAuthTokenById(authTokenId: string): Promise<boolean> {
        try {
            if (!authTokenId) {
                throw new Error("AuthToken ID is required.");
            }

            const isDeleted = await this.authTokenRepository.deleteAuthTokenById(authTokenId);
            return isDeleted;
        } catch (error) {
            console.error("Error deleting AuthToken by ID in AuthTokenService:", error);
            throw new Error("Failed to delete AuthToken.");
        }
    }
}