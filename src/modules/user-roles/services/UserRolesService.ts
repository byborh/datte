import { UserRoles } from "../entity/UserRoles.entity";
import { UserRolesRepositoryMySQL } from "../repositories/drivers/UserRolesRepositoryMySQL";

export class UserRolesService {
    private userRolesRepository: UserRolesRepositoryMySQL;

    constructor(userRolesRepository: UserRolesRepositoryMySQL) {
        this.userRolesRepository = userRolesRepository;
    }

    // Get a userRoles by ID
    public async getUserRolesById(user_id: string, role_id: string): Promise<UserRoles[] | null> {
        try {
            // Verify if user_id and role_id is provided
            if (!user_id ||!role_id) {
                throw new Error("UserRoles ID is required.");
            }

            // Call UserRolesRepository to find a userRoles by ID
            const userRolesEntity: UserRoles[] = await this.userRolesRepository.getUserRolesByMultipleFields(["user_id", "role_id"], [user_id, role_id]);

            // If no userRoles is found, return null
            if (!userRolesEntity || userRolesEntity.length === 0) throw new Error("UserRoles not found.");

            // Return the userRoles
            return userRolesEntity;
        } catch (error) {
            console.error("Error finding userRoles in UserRolesService:", error);
            throw new Error("Failed to find userRoles.");
        }
    }

    // Get all userRoles
    public async getUserRoles(): Promise<Array<UserRoles> | null> {
        try {
            // Call UserRolesRepository to find all userRoles
            const userRolesEntity: UserRoles[] = await this.userRolesRepository.getUserRoles();

            // If no userRoles are found, return null
            if (!userRolesEntity) return null;

            // Return all userRoles
            return userRolesEntity.map(userRolesEntity => userRolesEntity);
        } catch (error) {
            console.error("Error finding userRoles in UserRolesService:", error);
            throw new Error("Failed to find userRoles.");
        }
    }

    // Create userRoles
    public async createUserRoles(userRoles: UserRoles): Promise<UserRoles | null> {
        try {
            // Check if the userRoles already exists based on user_id and role_id
            const existingUserRoles: UserRoles[] | null = await this.userRolesRepository.getUserRolesByMultipleFields(["user_id", "role_id"], [userRoles.user_id, userRoles.role_id]);
            if (existingUserRoles || existingUserRoles.length > 0) {
                console.error("UserRoles already exists:", existingUserRoles);
                throw new Error("UserRoles already exists.");
            }

            // Create userRoles through repository
            const createdUserRoles: UserRoles | null = await this.userRolesRepository.createUserRoles(userRoles);

            // If userRoles creation fails, throw an error
            if (!createdUserRoles) {
                throw new Error("UserRoles didn't create...");
            }

            // Return the created userRoles
            return createdUserRoles;
        } catch (error) {
            console.error("Error creating userRoles in UserRolesService:", error);
            throw new Error("Failed to create userRoles.");
        }
    }
}
