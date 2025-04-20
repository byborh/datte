import { DatabaseType } from "@db/contract/DatabaseType";
import { UserRolesContract } from "../contracts/IUserRoles";
import { UserRolesAbstract } from "./UserRoles.abstract";
import { UserRolesRedisEntity } from "./redis/UserRoles.entity";
import { UserRolesSQLEntity } from "./sql/UserRoles.entity";
import { UserRolesMongoEntity } from "./mongo/UserRoles.entity";


const databaseType: DatabaseType = (process.env.MY_DB as DatabaseType) || "mysql"; // Default to MySQL if not specified


export async function createUserRolesEntity(userRoles: Partial<UserRolesContract>, dbType: DatabaseType = databaseType): Promise<UserRolesAbstract> {

    switch(dbType) {
        case "mysql":
        case "postgresql":
        case "sqlite":
        case "mariadb":
        case "mssql":
            return new UserRolesSQLEntity(userRoles);
        case "redis":
            return new UserRolesRedisEntity(userRoles);
        case "mongodb":
            return new UserRolesMongoEntity(userRoles);
        default:
            throw new Error("Unsupported database type.");
        
        // Add more cases for other database types that you want to support
    }
}