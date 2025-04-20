// import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { IDatabase } from "@db/contract/IDatabase";
import { UserMongoEntity } from "@modules/users/entity/mongo/User.entity";
import { RoleMongoEntity } from "@modules/roles/entity/mongo/Role.entity";
import { UserRolesMongoEntity } from "@modules/user-roles/entity/mongo/UserRoles.entity";
import { AuthTokenMongoEntity } from "@modules/auth-token/entity/mongo/AuthToken.entity";
import { ChatAIMongoEntity } from "@modules/chat-ai/entity/mongo/ChatAI.entity";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

export class MongoDatabase implements IDatabase {
    private dataSource: DataSource;

    constructor() {
        if (!process.env.MONGODB_URL) {
            throw new Error("Invalid or missing MongoDB URI");
        }

        this.dataSource = new DataSource({
            type: "mongodb",
            url: process.env.MONGODB_URL,
            entities: [UserMongoEntity, RoleMongoEntity, UserRolesMongoEntity, AuthTokenMongoEntity, ChatAIMongoEntity],
            synchronize: process.env.NODE_ENV !== "production",
            logging: process.env.NODE_ENV === "development",
        });
    }

    async connect(): Promise<void> {
        try {
            if (!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
                console.log("✅ Mongo Database connected");
            }
        } catch (error) {
            console.error("❌ MongoDB Connection Error:", error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            console.log("❌ Mongo Database disconnected");
        }
    }

    isConnected(): boolean {
        return this.dataSource.isInitialized;
    }

    getDataSource(): DataSource {
        return this.dataSource;
    }
}
