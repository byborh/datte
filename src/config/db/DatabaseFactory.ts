import { IDatabase } from "./contract/IDatabase";
import { SQLDatabase } from "./drivers/sql.datasource";
import { RedisDatabase } from "./drivers/redis.datasource";
import { DatabaseType } from "./contract/DatabaseType";
import { MongoDatabase } from "./drivers/mongo.datasource";

export class DatabaseFactory {
    static createDatabase(type: DatabaseType): IDatabase {

        switch (type) {
            case "mysql":
            case "postgresql":
            case "sqlite":
            case "mariadb":
            case "mssql":
                return new SQLDatabase();
            case "redis":
                return new RedisDatabase();
            case "mongodb":
                return new MongoDatabase();        
            default:
                throw new Error(`Unsupported database type: ${type}`);
            }
            // Add more cases for other database types that you want to support
    }
}