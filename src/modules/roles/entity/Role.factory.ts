import { DatabaseType } from "@db/contract/DatabaseType";
import { RoleRedisEntity } from "./redis/Role.entity";
import { RoleSQLEntity } from "./sql/Role.entity";
import { RoleAbstract } from "./Role.abstract";
import { RoleContract } from "../contracts/IRole";
import { RoleMongoEntity } from "./mongo/Role.entity";

const databaseType: DatabaseType = (process.env.MY_DB as DatabaseType) || "mysql"; // Default to MySQL if not specified


export async function createRoleEntity(role: Partial<RoleContract>, dbType: DatabaseType = databaseType): Promise<RoleAbstract> {

    // Validate required fields
    if (!role.id || !role.name) {
        throw new Error("Missing required fields for Role entity.");
    }

    switch(dbType) {
        case "mysql":
        case "postgresql":
        case "sqlite":
        case "mariadb":
        case "mssql":
            return new RoleSQLEntity(role);
        case "redis":
            return new RoleRedisEntity(role);
        case "mongodb":
            return new RoleMongoEntity(role);
        default:
            throw new Error("Unsupported database type.");
        
        // Add more cases for other database types that you want to support
    }
}