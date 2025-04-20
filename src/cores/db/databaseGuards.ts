import { IDatabase } from "@db/contract/IDatabase";
import { SQLDatabase } from "@db/drivers/sql.datasource";
import { RedisDatabase } from "@db/drivers/redis.datasource";
import { MongoDatabase } from "@db/drivers/mongo.datasource";

// Function to check if the database is of type SQL
function isSQLDatabase(db: IDatabase): db is SQLDatabase {
    return db instanceof SQLDatabase; // Verifies if the db instance is of type SQLDatabase
}

// Function to check if the database is of type Redis
function isRedisDatabase(db: IDatabase): db is RedisDatabase {
    return db instanceof RedisDatabase; // Verifies if the db instance is of type RedisDatabase
}

// Function to check if the database if og type MongoDB
function isMongoDatabase(db:IDatabase): db is MongoDatabase {
    return db instanceof MongoDatabase;
}

// Generic interface for repositories that accept a specific type of database
interface IRepository<T extends IDatabase> {
    new (db: T): any; // Constructor signature for creating a repository with the provided database type
}

// Function to get the appropriate repository based on the database type
export function getRepository<T extends IDatabase, R>(
    myDB: T,                    // The database instance to use (either SQL or Redis)
    sqlRepo: IRepository<SQLDatabase>,  // Repository class for SQL
    redisRepo: IRepository<RedisDatabase>,   // Repository class for Redis
    mongoRepo: IRepository<MongoDatabase>   // Repository class for MongoDB
): R {
    // If the database is SQL, create and return the corresponding SQL repository
    if (isSQLDatabase(myDB)) {
        return new sqlRepo(myDB as SQLDatabase) as R;  // Cast to SQLDatabase and instantiate the repository
    } 
    // If the database is Redis, create and return the corresponding Redis repository
    else if (isRedisDatabase(myDB)) {
        return new redisRepo(myDB as RedisDatabase) as R;  // Cast to RedisDatabase and instantiate the repository
    }
    // If the database is Mongo, create and return the corresponding Mongo repository
    else if (isMongoDatabase(myDB)) {
        return new mongoRepo(myDB as MongoDatabase) as R; // Cast to MongoDatabase and instantiate the repository
    }
    // If the database type is unsupported, throw an error
    throw new Error(`Unsupported database type: ${myDB.constructor.name}`);
}
