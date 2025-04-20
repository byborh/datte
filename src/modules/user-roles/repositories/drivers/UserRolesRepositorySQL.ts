import { Repository } from "typeorm";
import { IUserRolesRepository } from "../contract/IUserRolesRepository";
import { SQLDatabase } from "@db/drivers/sql.datasource";
import { IDatabase } from "@db/contract/IDatabase";
import { UserRolesSQLEntity } from "@modules/user-roles/entity/sql/UserRoles.entity";

export class UserRolesRepositorySQL implements IUserRolesRepository {
    private repository: Repository<UserRolesSQLEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as SQLDatabase;
        this.repository = dataSource.getDataSource().getRepository(UserRolesSQLEntity);
    }


    async getUserRolesByMultipleFields(fields: string[], values: string[]): Promise<UserRolesSQLEntity[] | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        })

        // Find userRoles
        const rawResult: UserRolesSQLEntity[] = await this.repository.find({where: conditions}) || null;

        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];

        if (rowsArray.length === 0) return [];

        // Return the array of userRoles
        return rowsArray;
    }

    async getUserRoles(): Promise<UserRolesSQLEntity[]> {
        // Fetch all userRole from the database
        const rawResult: UserRolesSQLEntity[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        return rowsArray;
    }

    async createUserRoles(userRoles: UserRolesSQLEntity): Promise<UserRolesSQLEntity | null> {
        // Insert the userRoles in the database
        const result = await this.repository.save(userRoles);

        // If the userRoles is not created, return null
        if (!result) return null;

        // Return the userRoles
        const userRolesEntity: UserRolesSQLEntity[] | null = await this.getUserRolesByMultipleFields(['user_id', 'role_id'], [userRoles.user_id, userRoles.role_id]) || null;

        return userRolesEntity[0];
    }

    async deleteUserRolesByMultipleFields(fields: string[], values: string[]): Promise<boolean> {
        if (fields.length !== values.length || fields.length === 0) return false;
    
        const conditions = fields.reduce((acc, field, index) => {
            acc[field] = values[index];
            return acc;
        }, {} as Record<string, string>);
    
        const result = await this.repository.delete(conditions);
    
        return result.affected !== undefined && result.affected > 0;
    }
    
}
