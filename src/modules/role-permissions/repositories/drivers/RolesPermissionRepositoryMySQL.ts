import { Repository } from "typeorm";
import { AppDataSource } from "@db/AppDataSource";
import { RolePermissions } from "@modules/role-permissions/entity/RolePermissions.entity";
import { IRolePermissionsRepository } from "../contract/IRolePermissionsRepository";

export class RolePermissionsRepositoryMySQL implements IRolePermissionsRepository {
    private repository: Repository<RolePermissions>;

    constructor() { this.repository = AppDataSource.getRepository(RolePermissions); }

    async getRolePermissionsByMultipleFields(fields: string[], values: string[]): Promise<RolePermissions | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        })

        // Find RolePermissions
        return await this.repository.findOne({where: conditions}) || null;
    }

    async getRolePermissions(): Promise<RolePermissions[]> {
        // Fetch all RolePermissions from the database
        const rawResult: RolePermissions[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        return rowsArray;
    }

    async createRolePermissions(RolePermissions: RolePermissions): Promise<RolePermissions | null> {
        // Insert the RolePermissions in the database
        const result = await this.repository.save(RolePermissions);

        // If the RolePermissions is not created, return null
        if (!result) return null;

        // Return the RolePermissions
        return this.getRolePermissionsByMultipleFields(['role_id', 'permission_id'], [RolePermissions.role_id, RolePermissions.permission_id]) || null;
    }
}
