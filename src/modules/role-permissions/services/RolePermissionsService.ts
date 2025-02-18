import { RolePermissions } from "../entity/RolePermissions.entity";
import { RolePermissionsRepositoryMySQL } from "../repositories/drivers/RolesPermissionRepositoryMySQL";

export class RolePermissionsService {
    private rolePermissionsRepository: RolePermissionsRepositoryMySQL;

    constructor(rolePermissionsRepository: RolePermissionsRepositoryMySQL) {
        this.rolePermissionsRepository = rolePermissionsRepository;
    }

    // Get a rolePermissions by ID
    public async getRolePermissionsById(role_id: string, permission_id: string): Promise<RolePermissions | null> {
        try {
            // Verify if permission_id and role_id is provided
            if (!role_id || !permission_id) {
                throw new Error("RolePermissions ID is required.");
            }

            // Call RolePermissionsRepository to find a rolePermissions by ID
            const rolePermissionsEntity: RolePermissions = await this.rolePermissionsRepository.getRolePermissionsByMultipleFields(["role_id", "permission_id"], [role_id, permission_id]);

            // If no rolePermissions is found, return null
            if (!rolePermissionsEntity) {
                throw new Error("RolePermissions not found.");
            }

            // Return the rolePermissions
            return rolePermissionsEntity;
        } catch (error) {
            console.error("Error finding rolePermissions in RolePermissionsService:", error);
            throw new Error("Failed to find rolePermissions.");
        }
    }

    // Get all rolePermissions
    public async getRolePermissions(): Promise<Array<RolePermissions> | null> {
        try {
            // Call RolePermissionsRepository to find all rolePermissions
            const rolePermissionsEntity: RolePermissions[] = await this.rolePermissionsRepository.getRolePermissions();

            // If no rolePermissions are found, return null
            if (!rolePermissionsEntity) return null;

            // Return all rolePermissions
            return rolePermissionsEntity.map(rolePermissionsEntity => rolePermissionsEntity);
        } catch (error) {
            console.error("Error finding rolePermissions in RolePermissionsService:", error);
            throw new Error("Failed to find rolePermissions.");
        }
    }

    // Create rolePermissions
    public async createRolePermissions(rolePermissions: RolePermissions): Promise<RolePermissions | null> {
        try {
            // Check if the rolePermissions already exists based on role_id and permission_id
            const existingRolePermissions: RolePermissions | null = await this.rolePermissionsRepository.getRolePermissionsByMultipleFields(["role_id", "permission_id"], [rolePermissions.role_id, rolePermissions.permission_id]);
            if (existingRolePermissions) {
                console.error("RolePermissions already exists:", existingRolePermissions);
                throw new Error("RolePermissions already exists.");
            }

            // Create rolePermissions through repository
            const createdRolePermissions: RolePermissions | null = await this.rolePermissionsRepository.createRolePermissions(rolePermissions);

            // If rolePermissions creation fails, throw an error
            if (!createdRolePermissions) throw new Error("RolePermissions didn't create...");

            // Return the created rolePermissions
            return createdRolePermissions;
        } catch (error) {
            console.error("Error creating rolePermissions in RolePermissionsService:", error);
            throw new Error("Failed to create rolePermissions.");
        }
    }
}
