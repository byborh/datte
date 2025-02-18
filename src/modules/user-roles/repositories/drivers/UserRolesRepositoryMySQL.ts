import { Repository } from "typeorm";
import { AppDataSource } from "@db/AppDataSource";
import { IUserRolesRepository } from "../contract/IUserRolesRepository";
import { UserRoles } from "@modules/user-roles/entity/UserRoles.entity";

export class UserRolesRepositoryMySQL implements IUserRolesRepository {
    private repository: Repository<UserRoles>;

    constructor() { this.repository = AppDataSource.getRepository(UserRoles); }

    async getUserRolesByMultipleFields(fields: string[], values: string[]): Promise<UserRoles[] | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        })

        // Find userRoles
        const rawResult: UserRoles[] = await this.repository.find({where: conditions}) || null;

        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];

        if (rowsArray.length === 0) return [];

        // Return the array of userRoles
        return rowsArray;
    }

    async getUserRoles(): Promise<UserRoles[]> {
        // Fetch all userRole from the database
        const rawResult: UserRoles[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        return rowsArray;
    }

    async createUserRoles(userRoles: UserRoles): Promise<UserRoles | null> {
        // Insert the userRoles in the database
        const result = await this.repository.save(userRoles);

        // If the userRoles is not created, return null
        if (!result) return null;

        // Return the userRoles
        const userRolesEntity: UserRoles[] | null = await this.getUserRolesByMultipleFields(['user_id', 'role_id'], [userRoles.user_id, userRoles.role_id]) || null;

        return userRolesEntity[0];
    }
}
