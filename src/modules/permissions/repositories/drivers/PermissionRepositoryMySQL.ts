import { Permission } from "@modules/permissions/entity/Permission.entity";
import { IPermissionRepository } from "../contract/IPermissionRepository";
import { Repository } from "typeorm";
import { AppDataSource } from "@db/AppDataSource";

export class PermissionRepositoryMySQL implements IPermissionRepository {
    private repository: Repository<Permission>;

    constructor() { this.repository = AppDataSource.getRepository(Permission); }

    async getPermissionByField(field: string, value: string): Promise<Permission | null> {
        // Validate field
        const allowedFields = ['id', 'action', 'resource', 'description'];
        if (!allowedFields.includes(field)) throw new Error(`Invalid field: ${field}`);

        // Find permission by field
        const row = await this.repository.findOne({ where: { [field]: value } });

        // Validate rows
        if (!row) return null;

        const permission = Array.isArray(row) ? row[0] : row;

        // Verify if all required fields are present
        if (!permission.id || !permission.action || !permission.resource) {
            console.error("Invalid permission data:", permission);
            throw new Error("Permission data is incomplete.");
        }

        return permission || null;
    }

    async getPermissionById(permissionId: string): Promise<Permission | null> {
        if (!permissionId) return null;
        return await this.getPermissionByField('id', permissionId) || null;
    }

    /**
     * Retrieves a permission from the database based on multiple fields and their corresponding values.
     * This method is useful when you need to find a permission using a combination of fields (e.g., action and resource, or description).
     * 
     * @param fields - An array of field names (e.g., ['CREATE', 'user']) to search by.
     * @param values - An array of values (e.g., ['DELETE', 'blog']) corresponding to the fields.
     * 
     * @returns A Promise that resolves to the found Permission object if a match is found, or null if no permission matches the conditions.
     * 
     * @example useage :
     * const permission = await getPermissionByMultipleFields(['CREATE', 'user'], ['DELETE', 'blog']);
     * 
     * @throws This method does not throw errors directly, but the underlying repository might throw errors
     * if there are issues with the database connection or query execution.
     */
    async getPermissionByMultipleFields(fields: string[], values: string[]): Promise<Permission | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        })

        // Find permission
        return await this.repository.findOne({where: conditions}) || null;
    }

    async getPermissions(): Promise<Permission[]> {
        // Fetch all permissions from the database
        const rawResult: Permission[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        return rowsArray;
    }

    async createPermission(permission: Permission): Promise<Permission | null> {
        // Insert the permission in the database
        const result = await this.repository.save(permission);

        // If the permission is not created, return null
        if (!result) return null;

        // Return the permission
        return this.getPermissionById(permission.id) || null;
    }

    async modifyPermission(permission: Permission): Promise<Permission | null> {
        // Be sure that permission exists
        const existingPermission: Permission = await this.repository.findOne({ where: { id: permission.id } });
        if (!existingPermission) return null;

        // Merge permission data with existing permission data
        this.repository.merge(existingPermission, permission);

        // Save the modified permission
        const result = await this.repository.save(existingPermission);

        // Return the permission
        return this.getPermissionById(permission.id) || null;
    }

    async deletePermission(permissionId: string): Promise<boolean> {
        const result = await this.repository.delete(permissionId);

        // Return true if the permission is deleted, false otherwise
        return !result ? false : true;
    }
}
