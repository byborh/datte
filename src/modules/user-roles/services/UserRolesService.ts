import { UserRolesAbstract } from "../entity/UserRoles.abstract";
import { createUserRolesEntity } from "../entity/UserRoles.factory";
import { IUserRolesRepository } from "../repositories/contract/IUserRolesRepository";

export class UserRolesService {
    private userRolesRepository: IUserRolesRepository;

    constructor(userRolesRepository: IUserRolesRepository) {
        this.userRolesRepository = userRolesRepository;
    }

    // Get a userRoles by ID
    public async getUserRolesById(user_id: string, role_id: string): Promise<UserRolesAbstract[] | null> {
        try {
            // Verify if user_id and role_id is provided
            if (!user_id ||!role_id) {
                throw new Error("UserRolesAbstract ID is required.");
            }

            // Call UserRolesRepository to find a userRoles by ID
            const userRolesEntity: UserRolesAbstract[] = await this.userRolesRepository.getUserRolesByMultipleFields(["user_id", "role_id"], [user_id, role_id]);

            // If no userRoles is found, return null
            if (!userRolesEntity || userRolesEntity.length === 0) throw new Error("UserRolesAbstract not found.");

            // Return the userRoles
            return userRolesEntity;
        } catch (error) {
            console.error("Error finding userRoles in UserRolesService:", error);
            throw new Error("Failed to find userRoles.");
        }
    }

    // Get all userRoles
    public async getUserRoles(): Promise<Array<UserRolesAbstract> | null> {
        try {
            // Call UserRolesRepository to find all userRoles
            const userRolesEntity: UserRolesAbstract[] = await this.userRolesRepository.getUserRoles();

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
    public async createUserRoles(userRoles: UserRolesAbstract): Promise<UserRolesAbstract | null> {
        try {
            const userRolesEntity = await createUserRolesEntity(userRoles);

            // Check if the userRoles already exists based on user_id and role_id
            const existingUserRoles: UserRolesAbstract[] | null = await this.userRolesRepository.getUserRolesByMultipleFields(["user_id", "role_id"], [userRolesEntity.user_id, userRolesEntity.role_id]);
            if (existingUserRoles) {
                console.error("UserRolesAbstract already exists:", existingUserRoles);
                throw new Error("UserRolesAbstract already exists.");
            }

            // Create userRoles through repository
            const createdUserRoles: UserRolesAbstract | null = await this.userRolesRepository.createUserRoles(userRolesEntity);

            // If userRoles creation fails, throw an error
            if (!createdUserRoles) {
                throw new Error("UserRolesAbstract didn't create...");
            }

            // Return the created userRoles
            return createdUserRoles;
        } catch (error) {
            console.error("Error creating userRoles in UserRolesService:", error);
            throw new Error("Failed to create userRoles.");
        }
    }

    public async deleteUserRoles(user_id: string, role_id: string): Promise<boolean> {
        try {
            if (!user_id || !role_id) return false;
    
            return await this.userRolesRepository.deleteUserRolesByMultipleFields(["user_id", "role_id"], [user_id, role_id]);
        } catch (error) {
            console.error("Error deleting userRoles in UserRolesService:", error);
            throw new Error("Failed to delete userRoles.");
        }
    }
    
}
