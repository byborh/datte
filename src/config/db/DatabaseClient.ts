/*
 * This code demonstrates a flexible and modular approach to interact with a database.
 * The key idea is to abstract the database interaction logic behind an interface (`IDatabase`),
 * allowing the application to switch between different databases (e.g., Redis, MySQL, etc.)
 * without changing the core logic of the application.
 *
 * The `IDatabase` interface defines the contract for database operations, and the `DatabaseFactory`
 * is responsible for creating the appropriate database instance based on the configuration.
 *
 * For example, if you want to switch from Redis to MySQL, you only need to:
 * 1. Implement the `IDatabase` interface for MySQL.
 * 2. Update the factory to create a MySQL instance instead of Redis.
 *
 * This approach ensures that your application remains decoupled from the specific database implementation,
 * making it easier to maintain and extend.
 */

import { DatabaseType } from "./contract/DatabaseType";
import { IDatabase } from "./contract/IDatabase"; // Import the database interface
import { DatabaseFactory } from "./DatabaseFactory"; // Import the factory to create database instances

let dbInstance: IDatabase | null = null; // Singleton instance of the database
const databaseType: DatabaseType = (process.env.MY_DB as DatabaseType) || "mysql"; // Default to MySQL if not specified

/*
 * Function to get the database instance.
 * If no instance exists, it creates one using the `DatabaseFactory` and connects to it.
 * This ensures that the database connection is initialized only once and reused throughout the application.
 */
export const getDatabase = async (): Promise<IDatabase> => {
    if (!dbInstance) {
        // Validate databaseType to ensure it is a valid DatabaseType
        if(
            databaseType !== "mysql"
            && databaseType !== "postgresql"
            && databaseType !== "sqlite"
            && databaseType !== "mariadb"
            && databaseType !== "mssql"
            && databaseType !== "redis"
            && databaseType !== "mongodb"
        ) {
            throw new Error(`Unsupported database type: ${databaseType}`);
        }
        
        // Create a database instance based on the configuration (e.g., "redis", "mysql", etc.)
        dbInstance = DatabaseFactory.createDatabase(databaseType); // Change "mysql" to "redis" or another database if needed
        await dbInstance.connect(); // Connect to the database
    }

    return dbInstance; // Return the initialized database instance
};

/*
 * Example Usage:
 * 
 * const myDB = await getDatabase();
 *
 * This code will work seamlessly whether the database is Redis, MySQL, or any other database
 * that implements the `IDatabase` interface.
 */