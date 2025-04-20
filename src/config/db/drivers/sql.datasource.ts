// import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { UserSQLEntity } from "@modules/users/entity/sql/User.entity";
import { RoleSQLEntity } from "@modules/roles/entity/sql/Role.entity";
import { AuthTokenSQLEntity } from "@modules/auth-token/entity/sql/AuthToken.entity";
import { ChatAISQLEntity } from "@modules/chat-ai/entity/sql/ChatAI.entity";
import { IDatabase } from "@db/contract/IDatabase";
import { UserRolesSQLEntity } from "@modules/user-roles/entity/sql/UserRoles.entity";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

export class SQLDatabase implements IDatabase {
    // Get DataSource instance
    private dataSource: DataSource;

    constructor() {
        // Get type of database from .env

        const dbType = process.env.MY_DB || "mysql"; // Default to MySQL if not specified
        let dbConfig: any;
    
        // Switch between database types
        switch(dbType) {
            case "mysql":
                if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
                    throw new Error("Missing MySQL environment variables");
                }
                dbConfig = {
                    type: "mysql",
                    host: process.env.MYSQL_HOST,
                    port: Number(process.env.MYSQL_PORT) || 3306,
                    username: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASSWORD,
                    database: process.env.MYSQL_DATABASE,
                };
                break;
            case "mariadb":
                if (!process.env.MARIADB_HOST || !process.env.MARIADB_USER || !process.env.MARIADB_PASSWORD || !process.env.MARIADB_DATABASE) {
                    throw new Error("Missing MariaDB environment variables");
                }
                dbConfig = {
                    type: "mariadb",
                    host: process.env.MARIADB_HOST,
                    port: Number(process.env.MARIADB_PORT) || 3306,
                    username: process.env.MARIADB_USER,
                    password: process.env.MARIADB_PASSWORD,
                    database: process.env.MARIADB_DATABASE,
                }
                break;
            case "postgresql":
                if (!process.env.POSTGRES_HOST || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD || !process.env.POSTGRES_DB) {
                    throw new Error("Missing PostgreSQL environment variables");
                }
                dbConfig = {
                    type: "postgres",
                    host: process.env.POSTGRES_HOST,
                    port: Number(process.env.POSTGRES_PORT) || 5432,
                    username: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.POSTGRES_DB,
                };
                break;
            case "sqlite":
                dbConfig = {
                    type: "sqlite",
                    database: process.env.SQLITE_DATABASE || "/app/data/database.sqlite",
                };
                break;
            case "mssql":
                if (!process.env.MSSQL_HOST || !process.env.MSSQL_USER || !process.env.MSSQL_PASSWORD || !process.env.MSSQL_DATABASE) {
                    throw new Error("Missing MSSQL environment variables");
                }
                dbConfig = {
                    type: "mssql",
                    host: process.env.MSSQL_HOST || "mssql",
                    port: Number(process.env.MSSQL_PORT) || 1433,
                    username: process.env.MSSQL_USER,
                    password: process.env.MSSQL_PASSWORD,
                    database: process.env.MSSQL_DATABASE,
                };
                break;
            default:
                throw new Error(`Unsupported database type: ${dbType}. Supported types are: mysql, mariadb, postgresql, sqlite, mssql`);
        }

        this.dataSource = new DataSource({
            ...dbConfig,
            entities: [UserSQLEntity, RoleSQLEntity, UserRolesSQLEntity, AuthTokenSQLEntity, ChatAISQLEntity],  // ADD ALL ENTITIES HERE
            synchronize: process.env.NODE_ENV !== "production",   // ATTENTION
            logging: process.env.NODE_ENV === "development",     // ATTENTION
        });
    }

    // Connect to database
    async connect(): Promise<void> {
        try {
            if(!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
                console.log("✅ SQL Database connected");
            }
        } catch (error) {
            console.error(`❌ SQL Connection Error in darabase "${process.env.MY_DB}":`, error);
            throw error;
        }
    }

    // Disconnect from database
    async disconnect(): Promise<void> {
        if(this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            console.log("❌ SQL Database disconnected");
        }
    }


    // Verify if database is connected
    isConnected(): boolean { return this.dataSource.isInitialized; }
    
    // Get DataSource
    getDataSource(): DataSource { return this.dataSource; }
}