import { DatabaseType } from "@db/contract/DatabaseType";
import { AuthTokenContract } from "../contracts/IAuthToken";
import { AuthTokenRedisEntity } from "./redis/AuthToken.entity";
import { AuthTokenSQLEntity } from "./sql/AuthToken.entity";
import { AuthTokenAbstract } from "./AuthToken.abstract";
import { AuthTokenMongoEntity } from "./mongo/AuthToken.entity";

const databaseType: DatabaseType = (process.env.MY_DB as DatabaseType) || "mysql"; // Default to MySQL if not specified


export async function createAuthTokenEntity(authToken: Partial<AuthTokenContract>, dbType: DatabaseType = databaseType): Promise<AuthTokenAbstract> {

    switch(dbType) {
        case "mysql":
        case "postgresql":
        case "sqlite":
        case "mariadb":
        case "mssql":
            return new AuthTokenSQLEntity(authToken);
        case "redis":
            return new AuthTokenRedisEntity(authToken);
        case "mongodb":
            return new AuthTokenMongoEntity(authToken);
        default:
            throw new Error("Unsupported database type.");
        
        // Add more cases for other database types that you want to support
    }
}