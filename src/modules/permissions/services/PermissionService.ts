import { Permission } from "../entity/Permission.entity";
import { PermissionRepositoryMySQL } from "../repositories/drivers/PermissionRepositoryMySQL";

export class PermissionService {
    private permissionRepository: PermissionRepositoryMySQL;

    constructor(permissionRepository: PermissionRepositoryMySQL) {
        this.permissionRepository = permissionRepository;
    }

    // Get a permission by ID
    public async getPermissionById(permissionId: string): Promise<Permission | null> {
        try {
            // Verify if permissionId is provided
            if (!permissionId) {
                throw new Error("Permission ID is required.");
            }

            // Call PermissionRepository to find a permission by ID
            const permissionEntity: Permission = await this.permissionRepository.getPermissionById(permissionId);

            // If no permission is found, return null
            if (!permissionEntity) {
                throw new Error("Permission not found.");
            }

            // Return the permission
            return permissionEntity;
        } catch (error) {
            console.error("Error finding permission in PermissionService:", error);
            throw new Error("Failed to find permission.");
        }
    }

    // Get all permissions
    public async getPermissions(): Promise<Array<Permission> | null> {
        try {
            // Call PermissionRepository to find all permissions
            const permissionsEntity: Permission[] = await this.permissionRepository.getPermissions();

            // If no permissions are found, return null
            if (!permissionsEntity) return null;

            // Return all permissions
            return permissionsEntity.map(permissionEntity => permissionEntity);
        } catch (error) {
            console.error("Error finding permissions in PermissionService:", error);
            throw new Error("Failed to find permissions.");
        }
    }

    // Create permission
    public async createPermission(permission: Permission): Promise<Permission | null> {
        try {
            // Check if the permission already exists based on action and resource
            const existingPermission: Permission | null = await this.permissionRepository.getPermissionByMultipleFields(["action", "resource"], [permission.getAction(), permission.getResource()]);
            if (existingPermission) {
                console.error("Permission already exists:", existingPermission);
                throw new Error("Permission already exists.");
            }

            // Create permission through repository
            const createdPermission: Permission | null = await this.permissionRepository.createPermission(permission);

            // If permission creation fails, throw an error
            if (!createdPermission) {
                throw new Error("Permission didn't create...");
            }

            // Return the created permission
            return createdPermission;
        } catch (error) {
            console.error("Error creating permission in PermissionService:", error);
            throw new Error("Failed to create permission.");
        }
    }

    // Modify permission
    public async modifyPermission(permissionId: string, data: Partial<Permission>): Promise<Permission | null> {
        try {
            // Verify if permission exists
            const existingPermission: Permission | null = await this.getPermissionById(permissionId);
            if (!existingPermission) {
                throw new Error("Permission not found.");
            }

            let hasChanges: boolean = false;

            // Update data in entity
            if (data.action && data.action !== existingPermission.getAction()) {
                existingPermission.setAction(data.action);
                hasChanges = true;
            }

            if (data.resource && data.resource !== existingPermission.getResource()) {
                existingPermission.setResource(data.resource);
                hasChanges = true;
            }

            if (data.description && data.description !== existingPermission.getDescription()) {
                existingPermission.setDescription(data.description);
                hasChanges = true;
            }

            // If no changes detected, throw an error
            if (!hasChanges) {
                throw new Error("No changes detected.");
            }

            // Update permission in the database
            const updatedPermission: Permission | null = await this.permissionRepository.modifyPermission(existingPermission);

            if (!updatedPermission) return null;

            // Return the updated permission
            return updatedPermission;
        } catch (error) {
            console.error("Error modifying permission in PermissionService:", error);
            throw new Error("Failed to modify permission.");
        }
    }

    // Delete permission
    public async deletePermission(permissionId: string): Promise<boolean> {
        try {
            // Verify if permissionId is provided
            if (!permissionId) {
                throw new Error("Permission ID is required.");
            }

            // Find the permission by ID
            const permission: Permission | null = await this.getPermissionById(permissionId);
            if (!permission) {
                console.error("Permission not found:", permissionId);
                return false;
            }

            // Delete the permission
            const isDeleted: boolean = await this.permissionRepository.deletePermission(permissionId);

            // Return true if the permission is deleted, false otherwise
            return isDeleted;
        } catch (error) {
            console.error("Error deleting permission in PermissionService:", error);
            throw new Error("Failed to delete permission.");
        }
    }
}
