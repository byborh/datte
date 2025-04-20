import { Repository } from "typeorm";
import { IUserRolesRepository } from "../contract/IUserRolesRepository";
import { MongoDatabase } from "@db/drivers/mongo.datasource";
import { IDatabase } from "@db/contract/IDatabase";
import { UserRolesMongoEntity } from "@modules/user-roles/entity/mongo/UserRoles.entity";

export class UserRolesRepositoryMongo implements IUserRolesRepository {
    private repository: Repository<UserRolesMongoEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as MongoDatabase;
        this.repository = dataSource.getDataSource().getRepository(UserRolesMongoEntity);
    }

    async getUserRolesByMultipleFields(fields: string[], values: string[]): Promise<UserRolesMongoEntity[] | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        });

        // Find userRoles
        const rawResult: UserRolesMongoEntity[] = await this.repository.find({ where: conditions }) || null;

        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];

        if (rowsArray.length === 0) return [];

        // Return the array of userRoles
        return rowsArray;
    }

    async getUserRoles(): Promise<UserRolesMongoEntity[]> {
        // Fetch all userRole from the database
        const rawResult: UserRolesMongoEntity[] = await this.repository.find();

        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];

        if (rowsArray.length === 0) return [];

        return rowsArray;
    }

    async createUserRoles(userRoles: UserRolesMongoEntity): Promise<UserRolesMongoEntity | null> {
        // Insert the userRoles in the database
        const result = await this.repository.save(userRoles);

        // If the userRoles is not created, return null
        if (!result) return null;

        // Return the userRoles
        const userRolesEntity: UserRolesMongoEntity[] | null = await this.getUserRolesByMultipleFields(['user_id', 'role_id'], [userRoles.user_id, userRoles.role_id]) || null;

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